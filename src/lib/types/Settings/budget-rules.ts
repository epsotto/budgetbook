/** Book-level budget rules shown in the Category Library tab. */
export interface BookBudgetRules {
	periodStartDay: 1 | 15 | 25;
	carryOverEnabled: boolean;
	startingBalance: string;
}
