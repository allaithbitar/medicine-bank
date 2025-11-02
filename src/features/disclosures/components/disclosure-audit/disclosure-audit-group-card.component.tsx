import { Box, Stack, Typography, IconButton, Chip } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import STRINGS from "@/core/constants/strings.constant";
import type { TAuditGroup, TAuditLogItem } from "../../types/disclosure.types";
import { formatDateTime } from "@/core/helpers/helpers";
import { orange, teal } from "@mui/material/colors";

const ActionChip = ({ action }: { action: string }) => {
  const color =
    action === "INSERT" ? "success" : action === "DELETE" ? "error" : "warning";
  return <Chip label={action} color={color as any} size="small" />;
};

const LogPreview = ({ log }: { log: TAuditLogItem }) => {
  const short = (v: any) => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "object") return JSON.stringify(v);
    const s = String(v);
    return s.length > 70 ? `${s.slice(0, 70)}...` : s;
  };

  return (
    <Box>
      <Stack direction="row" gap={1} alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {log.table ?? STRINGS.unknown}
          {log.column ? ` • ${log.column}` : ""}
        </Typography>
        <ActionChip action={log.action_type ?? "UPDATE"} />
      </Stack>

      <Typography variant="body2" sx={{ mt: 0.5 }}>
        <strong>{STRINGS.old}: </strong>
        <span>{short(log.old_value)}</span>
      </Typography>
      <Typography variant="body2">
        <strong>{STRINGS.new}: </strong>
        <span>{short(log.new_value)}</span>
      </Typography>
    </Box>
  );
};

const AuditGroupCard = ({
  group,
  onViewDetails,
}: {
  group: TAuditGroup;
  onViewDetails: (date: string) => void;
}) => {
  const headerContent = (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6" color="white" noWrap>
          {formatDateTime(group.createdAt)}
        </Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.9)">
          {group.logs.length} {STRINGS.changes}
        </Typography>
      </Box>

      <IconButton onClick={() => onViewDetails(group.createdAt)} size="small">
        <Visibility sx={{ color: "white" }} />
      </IconButton>
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${teal[400]}, ${orange[400]})`}
      bodyContent={
        <Stack gap={2}>
          {group.logs.map((l) => (
            <LogPreview key={l.id} log={l} />
          ))}
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default AuditGroupCard;
