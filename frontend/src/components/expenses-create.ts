import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {GetCategoriesType} from "../types/getCategories.type";

export class ExpensesCreate {
    readonly newExpenseName: HTMLInputElement | HTMLElement | null;
    readonly newExpenseButton: HTMLElement | null;

    constructor() {
        this.newExpenseName = document.getElementById('new-expense-name');
        this.newExpenseButton = document.getElementById('new-expense-button');
        const that: ExpensesCreate = this;

        if (this.newExpenseName && this.newExpenseButton) {
            this.newExpenseName.onchange = function (): void {
                if (!(that.newExpenseName as HTMLInputElement).value) {
                    (that.newExpenseName as HTMLElement).classList.add("is-invalid");
                } else {
                    (that.newExpenseName as HTMLElement).classList.remove("is-invalid");
                }
            }
            this.newExpenseButton.addEventListener("click", this.createExpense.bind(this));
        }
    }

    private async createExpense(): Promise<any> {
        try {
            if (!(this.newExpenseName as HTMLInputElement).value) {
                return;
            }
            const result: GetCategoriesType = await CustomHttp.request(config.host + '/categories/expense', 'POST',
                {"title": (this.newExpenseName as HTMLInputElement).value});
            if (!result || result.error) {
                throw new Error(result.message);
            }
            window.location.href = '#/expenses-view';
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    }

}