import { TransactionInstruction, PublicKey, ComputeBudgetProgram } from '@solana/web3.js';

export const processInstructionsForLazorKit = (
    instructions: TransactionInstruction[],
    smartWalletAddress: string
): TransactionInstruction[] => {
    const smartWallet = new PublicKey(smartWalletAddress);

    return instructions
        // 1. Remove ComputeBudget instructions (LazorKit handles compute)
        .filter(ix => !ix.programId.equals(ComputeBudgetProgram.programId))
        .map(ix => {
            // 2. Add smart wallet to all instructions if not present (LazorKit validation requirement)
            const hasSmartWallet = ix.keys.some(key => key.pubkey.equals(smartWallet));

            if (!hasSmartWallet) {
                // Return a new instruction with the smart wallet added
                return new TransactionInstruction({
                    programId: ix.programId,
                    keys: [
                        ...ix.keys,
                        { pubkey: smartWallet, isSigner: false, isWritable: false }
                    ],
                    data: ix.data
                });
            }
            return ix;
        });
};
