import { CompanyData } from '../models/company-data.model';

export const generateHierarchicalData = (childKey: string, level = 7, children = 6, iter = 0): CompanyData[] => {
    const returnArray: CompanyData[] = [];
    if (level === 0) {
        return returnArray;
    }
    for (let i = 0; i < children; i++) {
        iter++;
        returnArray.push({
            ID: `Dummy${iter}`,
            CompanyName: `Dummy-${iter}`,
            [childKey]: generateHierarchicalData(childKey, children, level - 1, iter)
        } as CompanyData);
    }
    return returnArray;
};
