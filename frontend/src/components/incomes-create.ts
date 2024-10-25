import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {GetCategoriesType} from "../types/getCategories.type";

export class IncomesCreate {
    readonly newIncomeName: HTMLInputElement | HTMLElement | null;
    readonly newIncomeButton: HTMLElement | null;

    constructor() {
        this.newIncomeName = document.getElementById('new-income-name');
        this.newIncomeButton = document.getElementById('new-income-button');
        const that: IncomesCreate = this;

        if (this.newIncomeName && this.newIncomeButton) {
            this.newIncomeName.onchange = function (): void {
                if (!(that.newIncomeName as HTMLInputElement).value) {
                    (that.newIncomeName as HTMLElement).classList.add("is-invalid");
                } else {
                    (that.newIncomeName as HTMLElement).classList.remove("is-invalid");
                }
            }
            this.newIncomeButton.addEventListener("click", this.createIncome.bind(this));
        }
    }

    private async createIncome(): Promise<any> {
        try {
            if (!(this.newIncomeName as HTMLInputElement).value) {
                return;
            }
            const result: GetCategoriesType = await CustomHttp.request(config.host + '/categories/income', 'POST',
                {"title": (this.newIncomeName as HTMLInputElement).value});
            if (!result || result.error) {
                throw new Error(result.message);
            }
            window.location.href = '#/incomes-view';
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