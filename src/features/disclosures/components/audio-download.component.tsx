import { Stack, Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import STRINGS from '@/core/constants/strings.constant';
import { baseUrl } from '@/core/api/root.api';
import { buildAudioDownloadFilename, downloadAnyFile, getVoiceSrc } from '@/core/helpers/helpers';
import { notifyError } from '@/core/components/common/toast/toast';
import { useState, type AudioHTMLAttributes } from 'react';

type TAudioDownloadProps = {
  title: string;
  src: string;
  filePath?: string | null;
  beneficiaryName?: string | null;
  scoutName?: string | null;
  getBlob?: () => Promise<Blob | null>;
  audioProps?: AudioHTMLAttributes<HTMLAudioElement>;
};

const AudioDownload = ({
  title,
  src,
  filePath,
  beneficiaryName,
  scoutName,
  getBlob,
  audioProps,
}: TAudioDownloadProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      let blob: Blob | null = null;

      if (getBlob) {
        blob = await getBlob();
      } else if (filePath) {
        const url = getVoiceSrc({ baseUrl, filePath });
        const resp = await fetch(url);
        if (!resp.ok) {
          notifyError(STRINGS.something_went_wrong);
          return;
        }
        blob = await resp.blob();
      }

      if (!blob) {
        notifyError(STRINGS.something_went_wrong);
        return;
      }

      const filename = buildAudioDownloadFilename({
        beneficiaryName,
        scoutName,
        filePath: filePath || undefined,
        mimeType: blob.type,
      });
      const file = new File([blob], filename, { type: blob.type });
      downloadAnyFile(file);
    } catch (err: any) {
      notifyError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Stack gap={1} sx={{ width: '100%' }}>
      <audio
        controlsList="nodownload"
        title={title}
        preload="metadata"
        style={{ width: '100%' }}
        controls
        src={src}
        {...audioProps}
      />
      <Button
        size="small"
        variant="outlined"
        startIcon={<DownloadIcon />}
        endIcon={isDownloading ? <CircularProgress size={14} /> : undefined}
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {STRINGS.download}
      </Button>
    </Stack>
  );
};

export default AudioDownload;
