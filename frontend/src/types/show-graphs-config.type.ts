export type ShowGraphsConfigType = {
    type: string,
    data: ShowGraphsConfigTypeData,
    options: ShowGraphsConfigTypeOptions
}

export type ShowGraphsConfigTypeData = {
    labels: Array<string>,
    datasets: Array<ShowGraphsConfigTypeDataDatasets>,
}

export type ShowGraphsConfigTypeDataDatasets = {
    label: string,
    data: Array<number>,
    backgroundColor?: Array<string>,
    hoverOffset: number
}

export type ShowGraphsConfigTypeOptions = {
    scales?: Object,
    responsive: boolean,
    plugins?: Object,
    animation: {animateScale: boolean},
    aspectRatio: number,
    maintainAspectRatio?: boolean,
    radius?: number,
    borderAlign: string
}

// export type ShowGraphsConfigTypeOptionsPlugins = {
//     legend: ShowGraphsConfigTypeOptionsPluginsLegend,
//     title: ShowGraphsConfigTypeOptionsPluginsTitle,
// }
//
// export type ShowGraphsConfigTypeOptionsPluginsLegend = {
//     position: string
// }
//
// export type ShowGraphsConfigTypeOptionsPluginsTitle = {
//     display: boolean,
//     text: string
// }
