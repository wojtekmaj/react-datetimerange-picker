type Range<T> = [T, T];

export type AmPmType = 'am' | 'pm';

export type ClassName = string | null | undefined | (string | null | undefined)[];

export type CloseReason = 'buttonClick' | 'escape' | 'outsideAction' | 'select';

export type Detail = 'hour' | 'minute' | 'second';

type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | Range<LooseValuePiece>;

export type OpenReason = 'buttonClick' | 'focus';

type ValuePiece = Date | null;

export type Value = ValuePiece | Range<ValuePiece>;
