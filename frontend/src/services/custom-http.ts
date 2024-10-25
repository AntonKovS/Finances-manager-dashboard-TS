import {Auth} from "./auth";
import {ValidFieldsType} from "../types/valid-fields.type";
import { GetOperationsType } from "../types/get-operations.type";

export class CustomHttp {
    public static async request(url: string, method: string = "GET", body: any = null): Promise<any> {

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };
        let token: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response: Response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                const result: boolean = await Auth.processUnauthorizedResponse();
                if (result) {
                    return await this.request(url, method, body);
                } else {
                    return null;
                }
            }
            throw new Error(response.statusText);
        }
        return await response.json();
    }

    private static inputsValidate(category: HTMLInputElement | null, amount: HTMLInputElement | null, date: HTMLInputElement | null, comment: HTMLInputElement | null): boolean {
        let validFields: ValidFieldsType = {
            inputCategory: false,
            inputAmount: false,
            inputDate: false,
            inputComment: false
        };

        if (category && amount && date && comment) {
            if (category.value === '0') {
                category.classList.add('is-invalid');
                validFields.inputCategory = false;
            } else {
                category.classList.remove('is-invalid');
                validFields.inputCategory = true;
            }
            if (!amount.value) {
                amount.classList.add('is-invalid');
                validFields.inputAmount = false;
            } else {
                amount.classList.remove('is-invalid');
                validFields.inputAmount = true;
            }
            if (!date.value) {
                date.classList.add('is-invalid');
                validFields.inputDate = false;
            } else {
                date.classList.remove('is-invalid');
                validFields.inputDate = true;
            }
            if (!comment.value) {
                comment.classList.add('is-invalid');
                validFields.inputComment = false;
            } else {
                comment.classList.remove('is-invalid');
                validFields.inputComment = true;
            }
        }

        return validFields.inputCategory && validFields.inputAmount && validFields.inputDate && validFields.inputComment;
    };

    public static createUpdateRequest(url: string, method: string, type: HTMLInputElement | null, category: HTMLInputElement | null, amount: HTMLInputElement | null, date: HTMLInputElement | null, comment: HTMLInputElement | null): void {
        try {
            if (type && category && amount && date && comment) {
                let valid: boolean = this.inputsValidate(category, amount, date, comment);
                if (valid) {
                    const result: Promise<GetOperationsType> = this.request(url, method, {
                        "type": (type as HTMLInputElement).value,
                        "amount": Number((amount as HTMLInputElement).value),
                        "date": (date as HTMLInputElement).value,
                        "comment": (comment as HTMLInputElement).value,
                        "category_id": Number((category as HTMLInputElement).value),
                    });
                        window.location.href = '#/incomes&expenses-view';
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    };

}