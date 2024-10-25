export type RouteType = {
    route: string,
    title: string,
    template: string,
    useLayout: string | false,
    styles: string,
    load(): void
}