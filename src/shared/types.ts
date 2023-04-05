export type AmPmType = 'am' | 'pm';

export type ClassName = string | null | undefined | (string | null | undefined)[];

export type Detail = 'hour' | 'minute' | 'second';

type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | [LooseValuePiece, LooseValuePiece];

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];
