declare const routerConfig: {
    path: string;
    component: any;
    children: ({
        path: string;
        component: any;
        redirect?: undefined;
    } | {
        path: string;
        redirect: string;
        component?: undefined;
    })[];
}[];
export default routerConfig;
