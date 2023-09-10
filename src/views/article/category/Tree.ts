export interface Tree {
    id: number
    label: string
    pid: number,
    parentPath?: string,
    path: string,
    children?: Tree[]
}