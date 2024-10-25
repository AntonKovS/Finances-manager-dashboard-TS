import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {GetOperationsType} from "../types/get-operations.type";
import {ErrorMessageType} from "../types/error-message.type";

export class OperationsView {
    readonly buttonFilter: NodeListOf<HTMLElement>;

    constructor() {
        this.buttonFilter = document.querySelectorAll('.filter-date .btn');
        this.init().then();
        this.buttonsListener(this.buttonFilter);
    }


    private async init(): Promise<void> {
        const operationsDefault: GetOperationsType[] | undefined = await UtilsCategoriesInfo.requestOperationByDate();
        if (operationsDefault) {
            this.showTable(operationsDefault);
        }

        const inputDateFrom: HTMLInputElement | null = document.getElementById('input-date-from') as HTMLInputElement;
        const inputDateTo: HTMLInputElement | null = document.getElementById('input-date-to') as HTMLInputElement;
        if (inputDateFrom && inputDateTo) {
            inputDateFrom.setAttribute('disabled', 'disabled');
            inputDateTo.setAttribute('disabled', 'disabled');
        }

        const createIncome: HTMLElement | null = document.getElementById('create-income');
        const createExpense: HTMLElement | null = document.getElementById('create-expense');
        if (createIncome && createExpense) {
            createIncome.addEventListener("click", (): void => {
                UtilsCategoriesInfo.setCategoryType('income');
                location.href = '#/incomes&expenses-create';
            });
            createExpense.addEventListener("click", (): void => {
                UtilsCategoriesInfo.setCategoryType('expense');
                location.href = '#/incomes&expenses-create';
            });
        }
    };

    buttonsListener(buttonFilter: NodeListOf<HTMLElement>): void {
        const that: OperationsView = this;
        Array.from(buttonFilter).forEach((button: HTMLElement): void => {
            button.addEventListener("click", (): void => {
                const categoriesInfo: Promise<GetOperationsType[]> | undefined = UtilsCategoriesInfo.processFilter(buttonFilter, button);
                if (categoriesInfo) {
                    categoriesInfo.then(function (resolve: GetOperationsType[]): void {
                        that.showTable(resolve);
                    });
                }
            })
        });
    };

    showTable(operations: GetOperationsType[]): void {
        const tableBody: HTMLElement | null = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '';

            let i: number = 0;
            operations.forEach((operation: GetOperationsType): void => {
                const trElement: HTMLTableRowElement = document.createElement('tr');
                trElement.insertCell().innerText = String(i + 1);
                trElement.insertCell().innerHTML = operation.type;
                const tdCategory: HTMLTableCellElement = trElement.childNodes[1] as HTMLTableCellElement;
                if (tdCategory) {
                    tdCategory.textContent === 'income' ? tdCategory.style.color = '#00c054' : tdCategory.style.color = 'red';
                }
                trElement.insertCell().innerHTML = operation.category;
                trElement.insertCell().innerHTML = operation.amount + ' ' + '$';
                trElement.insertCell().innerHTML = new Date(operation.date).toLocaleDateString("ru-RU");
                trElement.insertCell().innerHTML = operation.comment;

                const deleteElement: HTMLElement = document.createElement('a');
                deleteElement.setAttribute('href', 'javascript:void(0)');
                deleteElement.className = 'table-icon-delete me-2';
                const deleteElementIcon: HTMLElement = document.createElement('i');
                deleteElementIcon.className = 'fa-solid fa-trash-can';
                deleteElement.appendChild(deleteElementIcon);
                const editElement: HTMLElement = document.createElement('a');
                editElement.setAttribute('href', 'javascript:void(0)');
                editElement.className = 'table-icon-edit';
                const editElementIcon: HTMLElement = document.createElement('i');
                editElementIcon.className = 'fa-solid fa-pencil';
                editElement.appendChild(editElementIcon);

                tableBody.appendChild(trElement);

                trElement.insertCell().id = 'icons-' + operation.id;
                const iconsElement: HTMLElement = document.getElementById('icons-' + operation.id) as HTMLElement;
                iconsElement.className = 'text-nowrap';
                iconsElement.appendChild(deleteElement);
                iconsElement.appendChild(editElement);

                editElement.addEventListener('click', (): void => {
                    UtilsCategoriesInfo.setCategoryId(operation.id);
                    location.href = '#/incomes&expenses-edit';
                });

                deleteElement.addEventListener("click", (): void => {
                    const operationPopup: HTMLElement | null = document.getElementById('operation-popup');
                    if (operationPopup) {
                        operationPopup.style.display = 'flex';
                    }

                    const operationPopupNo: HTMLElement | null = document.getElementById('operation-popup-no');
                    if (operationPopupNo) {
                        operationPopupNo.addEventListener("click", (): void => {
                            location.href = '#/incomes&expenses-view';
                        });
                    }

                    const operationPopupYes: HTMLElement | null = document.getElementById('operation-popup-yes');
                    if (operationPopupYes) {
                        operationPopupYes.addEventListener("click", async (): Promise<void> => {
                            try {
                                const result: ErrorMessageType = await CustomHttp.request(config.host + '/operations/' + operation.id, 'DELETE');
                                if (result) {
                                    if (!result || result.error) {
                                        throw new Error(result.message);
                                    }
                                    window.location.href = '#/incomes&expenses-view';
                                }
                            } catch (error: unknown) {
                                if (error instanceof Error) {
                                    console.log(error.message);
                                } else {
                                    console.log("An unexpected error occurred", error);
                                }
                                return;
                            }
                        });
                    }
                });
                i++;
            });
        }
    }
}