import { IgxTreeNodeComponent, IgxTreeComponent, IgxTreeSearchResolver, IgxTreeNode } from 'igniteui-angular';
import { CompanyData } from '../models/company-data.model';

export class TreeDataHelper {
    public static mapData(data: CompanyData[]): void {
        data.forEach(x => {
            x.selected = false;
            if (x.hasOwnProperty('ChildCompanies') && x.ChildCompanies && x.ChildCompanies.length) {
                TreeDataHelper.mapData(x.ChildCompanies);
            }
        });
    }

    public static getNodeByName(tree: IgxTreeComponent, key: string): IgxTreeNodeComponent<CompanyData> {
        const nodes = tree.findNodes(key, (_term: string, n: IgxTreeNode<CompanyData>) => n.data?.ID === _term);
        return (nodes ? nodes[0] : undefined) as IgxTreeNodeComponent<CompanyData>;
    }

    public static createContainsComparer(): IgxTreeSearchResolver {
        return (term: string, node: IgxTreeNode<CompanyData>) => {
            return node.data?.ID?.toLowerCase()?.indexOf(term.toLowerCase()) > -1;
        };
    }
}
