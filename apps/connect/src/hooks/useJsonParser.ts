import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import { useMemo } from "react";
const ajv = new Ajv();

export interface Parser<T> {
    (json: string): T | undefined;
}

export default function useJsonParser<T>(schema: JTDSchemaType<T>): Parser<T> {
    const parse = useMemo(() => ajv.compileParser<T>(schema), [schema]);
    function parseJson(json: string): T | undefined {
        const result = parse(json);
        if (result === null) {
            console.error(parse.message, parse.position);
        }
        return result;
    }
    return parseJson;
}