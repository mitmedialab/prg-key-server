declare type URLParameters = {
    session: string;
};
declare function export_default(params: URLParameters): Promise<Record<string, string>>;

export { URLParameters, export_default as default };
