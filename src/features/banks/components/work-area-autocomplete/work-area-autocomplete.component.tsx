import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import type { IOcrMappingAutoCompleteProps } from "../../types/work-areas.types";
import type { IOptions } from "@/core/types/common.types";

const WorkAreaAutoComplete = ({
  value,
  onChange,
  autoCompleteProps,
  defaultValueId,
  helperText,
  textFieldError,
}: IOcrMappingAutoCompleteProps) => {
  const didSetDefaultValue = useRef(false);

  const workAreaOptions: IOptions[] = [
    {
      id: "1",
      name: "street1",
    },
    {
      id: "2",
      name: "street2",
    },
    {
      id: "3",
      name: "street3",
    },
  ];

  useEffect(() => {
    if (
      workAreaOptions.length > 0 &&
      !didSetDefaultValue.current &&
      defaultValueId
    ) {
      const defVal = workAreaOptions.find((c) => c.id === defaultValueId);
      if (defVal) {
        onChange(defVal);
        didSetDefaultValue.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workAreaOptions, defaultValueId]);

  return (
    <Autocomplete
      //   loading={isFetching}
      //   value={!isFetching ? value : null}
      //   disabled={isFetching || autoCompleteProps?.disabled}
      value={value}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={workAreaOptions}
      {...autoCompleteProps}
      disabled={autoCompleteProps?.disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={helperText}
          error={textFieldError}
          label="Work Area"
        />
        // <TextField {...params} label={`${isFetching ? t("Loading") }`} />
      )}
    />
  );
};

export default WorkAreaAutoComplete;
