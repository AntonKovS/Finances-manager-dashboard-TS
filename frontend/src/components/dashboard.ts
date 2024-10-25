import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {GetCategoriesRes} from "../types/getCategories.type";
import {GetOperationsType} from "../types/get-operations.type";
import Chart, {ChartItem} from 'chart.js/auto'
import {ChartConfiguration} from 'chart.js'

export class Dashboard {
    readonly ctx1: ChartItem | null;
    readonly ctx2: ChartItem | null;
    readonly buttonFilter: NodeListOf<HTMLElement>;
    private incomesCat: GetCategoriesRes[] | null;
    private expenseCat: GetCategoriesRes[] | null;
    private chart1: Chart | undefined | null;
    private chart2: Chart | undefined | null;

    constructor() {
        this.ctx1 = document.getElementById('myChart-1') as ChartItem;
        this.ctx2 = document.getElementById('myChart-2') as ChartItem;
        this.buttonFilter = document.querySelectorAll('.filter-date .btn');
        this.incomesCat = [];
        this.expenseCat = [];
        this.chart1 = null;
        this.chart2 = null;

        const inputDateFrom: HTMLElement | null = document.getElementById('input-date-from');
        const inputDateTo: HTMLElement | null = document.getElementById('input-date-to');
        if (inputDateFrom && inputDateTo) {
            inputDateFrom.setAttribute('disabled', 'disabled');
            inputDateTo.setAttribute('disabled', 'disabled');
        }
        // this.getCategoriesIncome().then(this.getCategoriesExpense()).then(this.showGraphsDefault()).then(this.buttonsListener(this.buttonFilter));

        // this.getCategoriesIncome().then();
        // this.getCategoriesExpense().then();
        // this.showGraphsDefault().then();
        // this.buttonsListener(this.buttonFilter);

        this.init().then();
    }

    // async disableElements() {
    //     const inputDateFrom = document.getElementById('input-date-from');
    //     const inputDateTo = document.getElementById('input-date-to');
    //     inputDateFrom.setAttribute('disabled', 'disabled');
    //     inputDateTo.setAttribute('disabled', 'disabled');
    // };

    private async init(): Promise<void> {
        try {
            await this.getCategoriesIncome();
            await this.getCategoriesExpense();
            await this.showGraphsDefault();
            this.buttonsListener(this.buttonFilter);
            // this.disableElements().then();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }

    };

    private async getCategoriesIncome(): Promise<void> {
        try {
            this.incomesCat = await CustomHttp.request(config.host + '/categories/income');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    };

    private async getCategoriesExpense(): Promise<void> {
        try {
            this.expenseCat = await CustomHttp.request(config.host + '/categories/expense');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    };

    private async showGraphsDefault(): Promise<void> {
        const operationsDefault: GetOperationsType[] | undefined = await UtilsCategoriesInfo.requestOperationByDate();
        if (operationsDefault) {
            this.showGraphs(operationsDefault);
        }
    };

    private buttonsListener(buttonFilter: NodeListOf<HTMLElement>): void {
        const that: Dashboard = this;
        Array.from(buttonFilter).forEach((button: HTMLElement): void => {
            button.addEventListener("click", (): void => {
                const categoriesInfo: Promise<GetOperationsType[]> | undefined = UtilsCategoriesInfo.processFilter(buttonFilter, button);
                if (categoriesInfo) {
                    categoriesInfo.then(function (resolve: GetOperationsType[] | null): void {
                        let chartStatus1 = Chart.getChart("myChart-1");
                        let chartStatus2 = Chart.getChart("myChart-2");
                        if (chartStatus1) {
                            chartStatus1.destroy();
                        }
                        if (chartStatus2) {
                            chartStatus2.destroy();
                        }
                        that.showGraphs(resolve);
                    });
                }
            })
        });
    };

    private showGraphs(operations: GetOperationsType[] | null): void {
        let config1: ChartConfiguration = {
            type: 'pie',
            data: {
                labels: [
                    // 'Red',
                    // 'Orange',
                    // 'Yellow',
                    // 'Green',
                    // 'Blue'
                ],
                datasets: [{
                    label: 'Сумма',
                    data: [
                        // 20, 50, 5, 15, 10
                    ],
                    // backgroundColor: [
                    //     // 'rgb(255, 99, 132)',
                    //     // 'rgb(255, 205, 86)',
                    //     // 'rgb(246,246,50)',
                    //     // 'rgb(100,217,53)',
                    //     // 'rgb(54, 162, 235)',
                    // ],
                    hoverOffset: 4
                }]
            },
            options: {
                scales: {},
                responsive: true,
                plugins: {
                    // legend: {
                    //     position: 'top',
                    // },
                    // title: {
                    //     display: true,
                    //     text: 'Доходы'
                    // }
                },
                // animation: {animateScale: true},
                // rotation: 90,
                aspectRatio: 1,
                // maintainAspectRatio: false,
                // radius: 190,
                // borderAlign: 'center'

            }
        };
        let config2: ChartConfiguration = {
            type: 'pie',
            data: {
                labels: [
                    // 'Red',
                    // 'Orange',
                    // 'Yellow',
                    // 'Green',
                    // 'Blue'
                ],
                datasets: [{
                    label: 'Сумма',
                    data: [
                        // 20, 50, 5, 15, 10
                    ],
                    // backgroundColor: [
                    //     'rgb(255, 99, 132)',
                    //     'rgb(255, 205, 86)',
                    //     'rgb(246,246,50)',
                    //     'rgb(100,217,53)',
                    //     'rgb(54, 162, 235)',
                    // ],
                    hoverOffset: 4
                }]
            },
            options: {
                scales: {},
                responsive: true,
                plugins: {
                    // legend: {
                    //     position: 'top',
                    // },
                    // title: {
                    //     display: true,
                    //     text: 'Доходы'
                    // }
                },
                // animation: {animateScale: true},
                // rotation: 90,
                aspectRatio: 1,
                // maintainAspectRatio: false,
                // radius: 190,
                // borderAlign: 'center'

            }
        };

        let incomesCatSum: Record<string, number> = {};
        let expenseCatSum: Record<string, number> = {};
        if (this.incomesCat) {
            this.incomesCat.forEach((income: GetCategoriesRes): void => {
                incomesCatSum[income.title] = 0;
                if (operations) {
                    operations.forEach((operation: GetOperationsType): void => {
                        if (operation && operation.type === 'income') {
                            if (operation.category === income.title) {
                                incomesCatSum[income.title] += operation.amount;
                            }
                        }
                    });
                }
            });
        }
        if (this.expenseCat) {
            this.expenseCat.forEach((expense: GetCategoriesRes): void => {                     //это из запроса
                expenseCatSum[expense.title] = 0;
                if (operations) {
                    operations.forEach((operation: GetOperationsType): void => {                       //это операции
                        if (operation && operation.type === 'expense') {
                            if (operation.category === expense.title) {
                                expenseCatSum[expense.title] += operation.amount;
                            }
                        }
                    });
                }
            });
        }

        for (let i: number = 0; i < Object.keys(incomesCatSum).length; i++) {
            if (config1.data.labels && Object.values(incomesCatSum)[i] !== 0) {
                config1.data.labels.push(Object.keys(incomesCatSum)[i]);
                config1.data.datasets[0].data.push(Number(Object.values(incomesCatSum)[i]));
            }
        }
        for (let i = 0; i < Object.keys(expenseCatSum).length; i++) {
            if (config2.data.labels && Object.values(expenseCatSum)[i] !== 0) {
                config2.data.labels.push(Object.keys(expenseCatSum)[i]);
                config2.data.datasets[0].data.push(Number(Object.values(expenseCatSum)[i]));
            }
        }

        if (this.ctx1 && config1) {
            this.chart1 = new Chart(this.ctx1, config1);
        }
        if (this.ctx2 && config2) {
            this.chart2 = new Chart(this.ctx2, config2);
        }

    };

}