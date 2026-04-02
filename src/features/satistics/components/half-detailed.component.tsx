import { Box, Stack, Typography, Card } from '@mui/material';
import { cyan, grey } from '@mui/material/colors';
import type { THalfDetailedStatisticsResult } from '../types/satistics.types';
import STRINGS from '@/core/constants/strings.constant';
import Nodata from '@/core/components/common/no-data/no-data.component';
import BarChartIcon from '@mui/icons-material/BarChart';

type Props = {
  data: THalfDetailedStatisticsResult;
};

const metricLabels = {
  addedDisclosures: STRINGS.added_disclosures,
  uncompletedVisits: STRINGS.not_completed_visits,
  completedVisits: STRINGS.completed_visits,
  cantBeCompletedVisits: STRINGS.couldnt_be_completed_visits,
  lateDisclosures: STRINGS.late_disclosures,
};

const disclosureTypeLabels = {
  new: STRINGS.new,
  return: STRINGS.return,
  help: STRINGS.help,
};

export const HalfDetailed = ({ data }: Props) => {
  const hasData = Object.entries(metricLabels).some(([key]) => {
    const metricData = data[key as keyof THalfDetailedStatisticsResult];
    return metricData && metricData.count > 0;
  });

  if (!hasData) {
    return <Nodata icon={BarChartIcon} title={STRINGS.no_data_found} />;
  }

  return (
    <Stack spacing={2}>
      {Object.entries(metricLabels).map(([key, label]) => {
        const metricData = data[key as keyof THalfDetailedStatisticsResult];
        if (!metricData || metricData.count === 0) return null;
        return (
          <Card
            key={key}
            sx={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
                paddingBottom: 2,
                borderBottom: `2px solid ${grey[300]}`,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: cyan[800],
                  fontWeight: 600,
                }}
              >
                {label}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: cyan[700],
                  fontWeight: 500,
                }}
              >
                {metricData.count}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(auto-fit, minmax(300px, 1fr))',
                },
                gap: 2,
              }}
            >
              {Object.entries(metricData.details).map(([disclosureType, disclosureData]) => {
                if (!disclosureData || disclosureData.count === 0) return null;
                return (
                  <Box
                    key={disclosureType}
                    sx={{
                      padding: 2,
                      background: grey[50],
                      border: `1px solid ${grey[300]}`,
                      borderRadius: '3px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#fff',
                        borderColor: cyan[200],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 2,
                        paddingBottom: 1.5,
                        borderBottom: `1px solid ${grey[300]}`,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: grey[800],
                        }}
                      >
                        {disclosureTypeLabels[disclosureType as keyof typeof disclosureTypeLabels]}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: cyan[700],
                        }}
                      >
                        {disclosureData.count}
                      </Typography>
                    </Box>
                    <Stack spacing={1.5}>
                      {disclosureData.details.map((priority, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: 2,
                            alignItems: 'center',
                            padding: 1.5,
                            background: '#fff',
                            border: `1px solid ${grey[200]}`,
                            borderRadius: '3px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: cyan[300],
                              background: cyan[50],
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              color: grey[800],
                              fontSize: '0.95rem',
                            }}
                          >
                            {priority.key}
                          </Typography>
                          <Typography
                            sx={{
                              color: cyan[800],
                              fontWeight: 600,
                              fontSize: '1.1rem',
                              minWidth: '40px',
                              textAlign: 'center',
                              padding: '4px 12px',
                              background: cyan[50],
                              border: `1px solid ${cyan[200]}`,
                              borderRadius: '3px',
                            }}
                          >
                            {priority.count}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Card>
        );
      })}
    </Stack>
  );
};
