export type JsonSimpleTypes = 'string' | 'number' | 'boolean'
export type JsonTypeDefinition =
  | {
      type: 'combination'
      children: JsonTypeDefinition[]
    }
  | {
      type: 'array'
      children?: JsonTypeDefinition[]
    }
  | {
      type: 'object'
      children?: {
        key: string
        type: JsonTypeDefinition
        optional: boolean
      }[]
    }
  | {
      type: 'null'
    }
  | {
      type: JsonSimpleTypes
      value: any
    }
