import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const SuitItem = styled(Box)(({ theme }) =>
    theme.unstable_sx({
        display: 'flex',
        height: '100px',
        widht: '100px',
        '&:hover': {
            cursor: 'pointer',
        },
    })
);