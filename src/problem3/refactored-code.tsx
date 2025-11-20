import React, { useMemo } from 'react';
import { BoxProps } from '@mui/material';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps { }

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
};

const getPriority = (blockchain: string): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = (props) => {
    const { ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                return balancePriority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                return rightPriority - leftPriority;
            })
            .map((balance: WalletBalance): FormattedWalletBalance => ({
                ...balance,
                formatted: balance.amount.toFixed(2),
            }));
    }, [balances]);

    const rows = useMemo(() => {
        return sortedBalances.map((balance: FormattedWalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;

            return (
                <WalletRow
                    key={balance.currency}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            );
        });
    }, [sortedBalances, prices]);

    return <div {...rest}>{rows}</div>;
};

export default WalletPage;

