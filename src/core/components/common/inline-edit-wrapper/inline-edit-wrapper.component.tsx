import { useState, useRef, useCallback, type ReactNode } from 'react';
import { Box, IconButton, CircularProgress, Button } from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import type { ZodSchema } from 'zod';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import FormSelectInput from '@/core/components/common/inputs/form-select-input.component';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import type { TListItem } from '@/core/types/input.type';

interface IInlineEditWrapperProps {
  editValue: any;
  fieldType: 'text' | 'textarea' | 'select' | 'date' | 'autocomplete';
  fieldKey: string;
  onSave: (fieldKey: any, newValue: any) => Promise<void>;
  canEdit: boolean;
  validation?: ZodSchema;
  selectOptions?: TListItem[];
  autocompleteOptions?: TListItem[];
  getOptionLabel?: (option: any) => string;
  disableClearable?: boolean;
  children: ReactNode;
}

const InlineEditWrapper = ({
  editValue,
  fieldType,
  fieldKey,
  onSave,
  canEdit,
  validation,
  selectOptions = [],
  autocompleteOptions = [],
  getOptionLabel = (option) => option.id,
  disableClearable = false,
  children,
}: IInlineEditWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(editValue);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string>('');
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSave = useCallback(async () => {
    if (validation) {
      const result = validation.safeParse(tempValue);
      if (!result.success) {
        notifyError(result.error.issues[0].message);
        return;
      }
    }
    setIsSaving(true);
    try {
      await onSave(fieldKey, tempValue);
      setIsEditing(false);
      notifySuccess(STRINGS.saved_successfully);
    } catch (error) {
      notifyError(error);
      setTempValue(editValue);
    } finally {
      setIsSaving(false);
    }
  }, [tempValue, validation, onSave, fieldKey, editValue]);

  const handleCancel = useCallback(() => {
    setTempValue(editValue);
    setIsEditing(false);
  }, [editValue]);

  const handleTouchStart = useCallback(() => {
    if (!canEdit || isEditing) return;
    longPressTimer.current = setTimeout(() => {
      setIsEditing(true);
      setTempValue(editValue);
    }, 500);
  }, [canEdit, isEditing, editValue]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleChange = (newValue: any) => {
    setTempValue(newValue);
  };

  const handleSelectOrDateChange = async (newValue: any) => {
    if (validation) {
      const result = validation.safeParse(newValue);
      if (!result.success) {
        setErrorText(result.error.issues[0].message);
        notifyError(result.error.issues[0].message);
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(fieldKey, newValue);
      setIsEditing(false);
      setErrorText('');
      notifySuccess(STRINGS.saved_successfully);
    } catch (error) {
      notifyError(error);
      setTempValue(editValue);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInputField = () => {
    switch (fieldType) {
      case 'text':
        return (
          <Box sx={{ minWidth: 200 }}>
            <FormTextFieldInput
              value={tempValue || ''}
              onChange={handleChange}
              disabled={isSaving}
              errorText={errorText}
            />
          </Box>
        );
      case 'textarea':
        return (
          <Box sx={{ minWidth: 200 }}>
            <FormTextAreaInput
              value={tempValue || ''}
              onChange={handleChange}
              disabled={isSaving}
              errorText={errorText}
              rows={3}
            />
          </Box>
        );
      case 'select':
        return (
          <Box sx={{ minWidth: 150 }}>
            <FormSelectInput
              value={tempValue || ''}
              onChange={handleSelectOrDateChange}
              options={selectOptions}
              getOptionLabel={getOptionLabel}
              disabled={isSaving}
              errorText={errorText}
              disableClearable={disableClearable}
            />
          </Box>
        );
      case 'date':
        return (
          <Box sx={{ minWidth: 200 }}>
            <FormDateInput
              value={tempValue || ''}
              onChange={handleSelectOrDateChange}
              disabled={isSaving}
              errorText={errorText}
            />
          </Box>
        );
      case 'autocomplete':
        return (
          <Box sx={{ minWidth: 200 }}>
            <FormAutocompleteInput
              value={tempValue}
              onChange={handleSelectOrDateChange}
              options={autocompleteOptions}
              getOptionLabel={getOptionLabel}
              disabled={isSaving}
              errorText={errorText}
            />
          </Box>
        );
      default:
        return null;
    }
  };
  if (isEditing) {
    const needsSaveButtons = fieldType === 'text' || fieldType === 'textarea';
    return (
      <Box display="flex" alignItems="center" gap={1} flexDirection="column">
        <Box display="flex" alignItems="center" gap={1} width="100%">
          {renderInputField()}
          {isSaving && <CircularProgress size={20} />}
        </Box>
        {needsSaveButtons && (
          <Box display="flex" gap={1} justifyContent="flex-end" width="100%">
            <Button size="small" onClick={handleCancel} startIcon={<CloseIcon />} disabled={isSaving}>
              {STRINGS.cancel}
            </Button>
            <Button size="small" variant="contained" onClick={handleSave} startIcon={<CheckIcon />} disabled={isSaving}>
              {STRINGS.save}
            </Button>
          </Box>
        )}
      </Box>
    );
  }
  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        cursor: canEdit ? 'pointer' : 'default',
        '&:hover .edit-icon': {
          opacity: canEdit ? 1 : 0,
        },
      }}
    >
      {children}
      {canEdit && (
        <IconButton
          className="edit-icon"
          size="small"
          sx={{
            opacity: { xs: 1, sm: 0 },
            transition: 'opacity 0.2s',
            p: 0.5,
          }}
        >
          <EditIcon fontSize="small" color="action" />
        </IconButton>
      )}
    </Box>
  );
};

export default InlineEditWrapper;
