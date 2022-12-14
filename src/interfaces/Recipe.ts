import { Link } from "./Link";

export interface Recipe {
    title: string,
    byline: string,
    location: string,
    components: string[][],
    directions: string[],
    background: string,
    links: Link[],
    flavor: string,
}