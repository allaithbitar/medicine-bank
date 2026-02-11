import STRINGS from '@/core/constants/strings.constant';
import { Box, Typography, Stack, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { notifyError } from '@/core/components/common/toast/toast';
import { MAX_AUDIO_SIZE_BYTES } from '@/core/constants/properties.constant';
import type z from 'zod';

export type TAudioFile = {
  audioBlob: Blob | null;
  audioName: string | null;
};

function AudioPlayer({
  setErrors,
  setAudioFile,
}: {
  setErrors: Dispatch<SetStateAction<z.ZodIssue[]>>;
  audioFile?: TAudioFile;
  setAudioFile: Dispatch<SetStateAction<TAudioFile | undefined>>;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setErrors([]);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      notifyError('Media devices not supported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size > MAX_AUDIO_SIZE_BYTES) {
          notifyError(new Error(STRINGS.file_too_large));
          stream.getTracks().forEach((t) => t.stop());
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
      };
      mr.start();
      setIsRecording(true);
    } catch (err) {
      notifyError(err);
    }
  };
  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    mr.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
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
          {!isRecording ? (
            <Button variant="contained" startIcon={<MicIcon />} onClick={startRecording}>
              {STRINGS.start_recording}
            </Button>
          ) : (
            <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={stopRecording}>
              {STRINGS.stop_recording}
            </Button>
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
            <audio controlsList="nodownload" controls src={audioUrl} style={{ flexGrow: 1 }} />
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
