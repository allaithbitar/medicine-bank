import Nodata from '@/core/components/common/no-data/no-data.component';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/properties.constant';
import STRINGS from '@/core/constants/strings.constant';
import DisclosureCard from '@/features/disclosures/components/disclosure-card.component';
import { useDisclosuresLoader } from '@/features/disclosures/hooks/disclosures-loader.hook';
import { Button, Card, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const BeneficiaryDisclosures = ({ beneficiaryId }: { beneficiaryId?: string }) => {
  const { items, isLoading, isFetching } = useDisclosuresLoader({
    pageSize: DEFAULT_PAGE_SIZE,
    patientId: beneficiaryId,
  });

  const isEmpty = !isLoading && !isFetching && items.length === 0;

  return (
    <Stack>
      {items.map((d) => (
        <DisclosureCard disclosure={d} />
      ))}
      {isEmpty && (
        <Card>
          <Nodata
            title={STRINGS.beneficiary_doesnt_have_any_disclosure}
            extra={
              <Link to={`/disclosures/action?beneficiaryId=${beneficiaryId}`}>
                <Button>{STRINGS.add}</Button>
              </Link>
            }
          />
        </Card>
      )}
    </Stack>
  );
};

export default BeneficiaryDisclosures;
