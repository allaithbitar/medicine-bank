import STRINGS from '@/core/constants/strings.constant';
import { Box, Typography, Stack, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { notifyError } from '@/core/components/common/toast/toast';
import { MAX_AUDIO_SIZE_BYTES } from '@/core/constants/properties.constant';
import type z from 'zod';
import { baseUrl } from '@/core/api/root.api';
import { getVoiceSrc } from '@/core/helpers/helpers';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { readAudioFile } from '@/core/helpers/opfs-audio.helpers';

export type TAudioFile = {
  audioBlob: Blob | null;
  audioName: string | null;
};

function AudioPlayer({
  setErrors,
  setAudioFile,
  audioFile,
}: {
  setErrors?: Dispatch<SetStateAction<z.ZodIssue[]>>;
  audioFile?: TAudioFile;
  setAudioFile: Dispatch<SetStateAction<TAudioFile | undefined>>;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalizeRef = useRef<boolean>(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const isOffline = useIsOffline();
  const [offlineAudioObjectUrl, setOfflineAudioObjectUrl] = useState('');

  const chunksRef = useRef<Blob[]>([]);

  const createRecorder = (stream: MediaStream, options: MediaRecorderOptions) => {
    const mr = new MediaRecorder(stream, options);

    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      if (!finalizeRef.current) {
        return;
      }

      const blob = new Blob(chunksRef.current, {
        type: options.mimeType || 'audio/webm',
      });

      if (blob.size > MAX_AUDIO_SIZE_BYTES) {
        notifyError(new Error(STRINGS.file_too_large));
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        setIsRecording(false);
        setIsPaused(false);
        return;
      }

      const url = URL.createObjectURL(blob);
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      setAudioFile({
        audioName: null,
        audioBlob: blob,
      });

      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      chunksRef.current = [];
      setIsRecording(false);
      setIsPaused(false);
    };

    mr.start();
  };

  useEffect(() => {
    if (audioFile?.audioName && !audioFile?.audioBlob) {
      if (isOffline) {
        readAudioFile(audioFile.audioName).then((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setOfflineAudioObjectUrl(url);
            setAudioUrl(url);
          }
        });
      } else {
        const url = getVoiceSrc({ baseUrl, filePath: audioFile.audioName });
        setAudioUrl(url);
      }
    }

    return () => {
      if (offlineAudioObjectUrl) {
        URL.revokeObjectURL(offlineAudioObjectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile?.audioName, audioFile?.audioBlob, isOffline]);

  const startRecording = async () => {
    setErrors?.([]);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      notifyError('Media devices not supported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options: MediaRecorderOptions = {
        audioBitsPerSecond: 32000,
      };
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      }

      chunksRef.current = [];
      finalizeRef.current = true;

      createRecorder(stream, options);

      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      notifyError(err);
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr) {
      finalizeRef.current = true;
      try {
        if (mr.state !== 'inactive') mr.stop();
      } catch (err) {
        notifyError(err);
      }
      return;
    }

    if (!chunksRef.current.length) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsRecording(false);
      setIsPaused(false);
      return;
    }

    const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || 'audio/webm' });
    if (blob.size > MAX_AUDIO_SIZE_BYTES) {
      notifyError(new Error(STRINGS.file_too_large));
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      chunksRef.current = [];
      return;
    }

    const url = URL.createObjectURL(blob);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    setAudioFile({
      audioName: null,
      audioBlob: blob,
    });

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;

    try {
      if (typeof mr.pause === 'function' && mr.state === 'recording') {
        mr.pause();
        setIsPaused(true);
        setIsRecording(false);
      } else {
        finalizeRef.current = false;
        mr.stop();
        mediaRecorderRef.current = null;
        setIsPaused(true);
        setIsRecording(false);
      }
    } catch (err) {
      notifyError(err);
    }
  };

  const resumeRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr) {
      try {
        if (typeof mr.resume === 'function' && mr.state === 'paused') {
          mr.resume();
          setIsPaused(false);
          setIsRecording(true);
          return;
        }
      } catch (err) {
        notifyError(err);
      }
    }

    const stream = streamRef.current;
    if (!stream) {
      notifyError('No active recording stream to resume');
      return;
    }

    const options: MediaRecorderOptions = {
      audioBitsPerSecond: 32000,
    };
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      options.mimeType = 'audio/webm;codecs=opus';
    }

    finalizeRef.current = false;
    createRecorder(stream, options);
    setIsPaused(false);
    setIsRecording(true);
  };

  const handleFileSelect = (f?: File | null) => {
    if (!f) return;
    if (f.size > MAX_AUDIO_SIZE_BYTES) {
      notifyError(STRINGS.file_too_large);
      return;
    }
    setAudioFile({
      audioName: f.name,
      audioBlob: f,
    });
    const url = URL.createObjectURL(f);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  };

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioFile({
      audioName: null,
      audioBlob: null,
    });
  };

  useEffect(() => {
    return () => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          finalizeRef.current = true;
          mediaRecorderRef.current.stop();
        }
      } catch {
        // ignore
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <Stack gap={1}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {STRINGS.record_audio}
      </Typography>

      <Stack gap={1}>
        <Stack direction="row" gap={1} alignItems="center">
          {!isRecording && !isPaused ? (
            <Button variant="contained" startIcon={<MicIcon />} onClick={startRecording}>
              {STRINGS.start_recording}
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button variant="outlined" color="warning" startIcon={<PauseIcon />} onClick={pauseRecording}>
                  {STRINGS.pause_recording}
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />} onClick={resumeRecording}>
                  {STRINGS.resume_recording}
                </Button>
              )}
              <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={stopRecording}>
                {STRINGS.stop_recording}
              </Button>
            </>
          )}
          <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
            {STRINGS.upload_audio}
            <input hidden accept="audio/*" type="file" onChange={handleFileInput} />
          </Button>
        </Stack>
        {isRecording && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'error.main',
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'error.main',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.5,
                    transform: 'scale(1.2)',
                  },
                },
              }}
            />
            <Typography variant="body2">{STRINGS.recording}</Typography>
          </Box>
        )}
        {audioUrl && (
          <Stack direction="row" gap={1} alignItems="center">
            <audio controls preload="metadata" src={audioUrl} style={{ flexGrow: 1 }} />
            <Button size="small" onClick={clearAudio}>
              {STRINGS.clear}
            </Button>
          </Stack>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {STRINGS.audio_help_text}
      </Typography>
    </Stack>
  );
}

export default AudioPlayer;
