import {CustomHttp} from "../src/services/custom-http";
import config from "../config/config";
import {GetCategoriesType} from "../src/types/getCategories.type";
import {GetOperationsType} from "../src/types/get-operations.type";
import Chart from 'chart.js/auto'


export class UtilsCategoriesInfo {
    private static categoryIdKey: string = 'categoryId';
    private static categoryTypeKey: string = 'categoryType';

    public static async createSelectCategories(typeElement: HTMLInputElement, categoryElement: HTMLInputElement, categoryId: string | null = null): Promise<void> {
        try {
            if (typeElement.value) {
                categoryElement.innerHTML = '<option value="0">Категория...</option>';
                const result: GetCategoriesType[] | null = await CustomHttp.request(config.host + '/categories/' + typeElement.value);
                if (result && result.length > 0) {
                    result.forEach((res: GetCategoriesType): void => {
                        const createOption: HTMLElement = document.createElement('option');
                            if (res.title && res.id) {
                                createOption.innerText = res.title;
                                createOption.setAttribute('value', res.id.toString());
                                categoryElement.appendChild(createOption);                            
                                if (categoryId && categoryElement.value && res.title === categoryId) {
                                    categoryElement.value = res.id.toString();
                                }
                            }
                    });
                }
                categoryElement.style.color = categoryElement.value === '0' ? 'grey' : 'black';
            } else {
                location.href = '#/incomes&expenses-view';
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

    public static inputsListeners(typeElement: HTMLInputElement, categoryElement: HTMLInputElement, amountElement: HTMLInputElement, dateElement: HTMLInputElement): void {
        typeElement.addEventListener('input', (): void => {
            categoryElement.innerHTML = '<option value="0">Категория...</option>';
            categoryElement.style.color = categoryElement.value === '0' ? 'grey' : 'black';
            this.createSelectCategories(typeElement, categoryElement).then();
        });
        categoryElement.addEventListener('input', (): void => {
            categoryElement.style.color = categoryElement.value === '0' ? 'grey' : 'black';
        });
        amountElement.addEventListener('input', function (): void {
            this.value = this.value.replace(/\D/, '');
        });
        dateElement.addEventListener('input', function (): void {
            let maxLength: number = 10;
            if (this.value.length > maxLength) {
                this.value = this.value.substring(10, maxLength);
            }
        });
    }

    public static processFilter(buttonFilter: NodeListOf<HTMLElement>, button: HTMLElement): Promise<GetOperationsType[]> | undefined {
        let inputDateFrom: HTMLInputElement | null = document.getElementById('input-date-from') as HTMLInputElement;
        let inputDateTo: HTMLInputElement | null = document.getElementById('input-date-to') as HTMLInputElement;
        if (inputDateFrom && inputDateTo) {
            inputDateFrom.setAttribute('disabled', 'disabled');
            inputDateTo.setAttribute('disabled', 'disabled');
            inputDateFrom.classList.remove('is-invalid');
            inputDateTo.classList.remove('is-invalid');
        }
        // const that: UtilsCategoriesInfo = this;
        Array.from(buttonFilter).forEach(button => {
            button.classList.remove('active');
        });
        button.classList.add('active');

        let int: string = button.className.split(/-| /)[2];
        // console.log(button.className.split(/[\s-]/)[2]);

        if (int === "interval" && inputDateFrom && inputDateTo) {
            inputDateFrom.removeAttribute('disabled');
            inputDateTo.removeAttribute('disabled');

            let tableBody: HTMLElement | null = document.getElementById('table-body');
            if (tableBody) {
                tableBody.innerHTML = '';
            }
            let chartStatus1 = Chart.getChart("myChart-1");
            let chartStatus2 = Chart.getChart("myChart-2");
            if (chartStatus1 || chartStatus2) {
                if (chartStatus1) {
                    chartStatus1.destroy();
                }
                if (chartStatus2) {
                    chartStatus2.destroy();
                }
            }

            inputDateFrom.addEventListener('input', function (): void {
                let maxLength: number = 10;
                if ((this as HTMLInputElement).value.length > maxLength) {
                    (this as HTMLInputElement).value = (this as HTMLInputElement).value.substring(10, maxLength);
                }
            });
            inputDateTo.addEventListener('input', function (): void {
                let maxLength: number = 10;
                if ((this as HTMLInputElement).value.length > maxLength) {
                    (this as HTMLInputElement).value = (this as HTMLInputElement).value.substring(10, maxLength);
                }
            });

            let validInputDateFrom: boolean = false;
            let validInputDateTo: boolean = false;

            inputDateFrom.addEventListener('focusout', function (): void {
                if (!(inputDateFrom as HTMLInputElement).value) {
                    (inputDateFrom as HTMLInputElement).classList.add('is-invalid');
                    validInputDateFrom = false;
                } else {
                    (inputDateFrom as HTMLInputElement).classList.remove('is-invalid');
                    validInputDateFrom = true;
                    if (validInputDateTo) {
                        let newInt: string = 'interval&dateFrom=' + (inputDateFrom as HTMLInputElement).value + '&dateTo=' + (inputDateTo as HTMLInputElement).value;
                        const requestOperations: Promise<GetOperationsType[]> | undefined = UtilsCategoriesInfo.requestOperationByDate(newInt);
                        if (requestOperations) {
                            requestOperations.then((resolve: GetOperationsType[]) => {
                                return resolve;
                            });
                        }
                        button.click();
                    }
                }
            });
            inputDateTo.addEventListener('focusout', function (): void {
                if ((inputDateTo as HTMLInputElement).value.length !== 10) {
                    (inputDateTo as HTMLInputElement).classList.add('is-invalid');
                    validInputDateTo = false;
                } else {
                    (inputDateTo as HTMLInputElement).classList.remove('is-invalid');
                    validInputDateTo = true;
                    if (validInputDateFrom) {
                        let newInt: string = 'interval&dateFrom=' + (inputDateFrom as HTMLInputElement).value + '&dateTo=' + (inputDateTo as HTMLInputElement).value;
                        const requestOperations: Promise<GetOperationsType[]> | undefined = UtilsCategoriesInfo.requestOperationByDate(newInt);
                        if (requestOperations) {
                            requestOperations.then((resolve: GetOperationsType[]) => {
                                return resolve;
                            });
                        }
                        button.click();
                    }
                }
            });

            if (inputDateFrom.value && inputDateTo.value) {
                let newInt: string = 'interval&dateFrom=' + inputDateFrom .value + '&dateTo=' + inputDateTo.value;
                const requestOperations: Promise<GetOperationsType[]> | undefined = this.requestOperationByDate(newInt);
                if (requestOperations) {
                    return requestOperations.then((resolve: GetOperationsType[]) => {
                        return resolve;
                    });
                }
            } else {
                let newInt: string = 'interval&dateFrom=0000-00-00&dateTo=0000-00-00';
                const requestOperations: Promise<GetOperationsType[]> | undefined = this.requestOperationByDate(newInt);
                if (requestOperations) {
                    return requestOperations.then((resolve: GetOperationsType[]) => {
                        return resolve;
                    });
                }
            }
        } else {
            const requestOperations: Promise<GetOperationsType[]> | undefined = this.requestOperationByDate(int);
            if (requestOperations) {
                return requestOperations.then((resolve: GetOperationsType[]) => {
                    return resolve;
                });
            }

        }
    }

    public static requestOperationByDate(int: string = 'today'): Promise<GetOperationsType[]> | undefined {
        try {
            const result: Promise<GetOperationsType[]> | undefined = CustomHttp.request(config.host + '/operations?period=' + int);
            if (result) {
                return result;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    }

    public static setCategoryId(info: number): void {
            localStorage.setItem(this.categoryIdKey, JSON.stringify(info));
    }

    public static getCategoryId(): number | null {
            const categoryId: string | null = localStorage.getItem(this.categoryIdKey);
            if (categoryId) {
                return Number(JSON.parse(categoryId));
            }
            return null;
    }

    public static removeCategoryId(): void {
            localStorage.removeItem(this.categoryIdKey);
    }

    public static setCategoryType(info: string): void {
        localStorage.setItem(this.categoryTypeKey, JSON.stringify(info));
    }

    public static getCategoryType(): string | null {
        const categoryType: string | null = localStorage.getItem(this.categoryTypeKey);
        if (categoryType) {
            return JSON.parse(categoryType);
        }
        return null;
    }

    public static removeCategoryType(): void {
        localStorage.removeItem(this.categoryTypeKey);
    }

}