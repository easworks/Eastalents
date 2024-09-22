export interface IndustryGroupDTO {
  [key: string]: string[];
}

export interface IndustryGroup {
  name: string;
  industries: string[];
}

export class IndustryGroupDTO {
  static toList(dto: IndustryGroupDTO) {
    return Object.entries(dto)
      .map<IndustryGroup>(([name, industries]) => ({ name, industries }));
  }

  static fromList(list: IndustryGroup[]) {
    return list.reduce(
      (prev, current) => {
        prev[current.name] = current.industries;
        return prev;
      },
      {} as IndustryGroupDTO
    );
  }
}
