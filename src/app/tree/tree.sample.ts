import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IgxTreeNodeComponent,
    IgxTreeComponent,
    ITreeNodeTogglingEventArgs,
    ITreeNodeToggledEventArgs,
    ITreeNodeSelectionEvent,
    IgxTreeNode,
    IgxButtonDirective,
    IgxButtonGroupComponent,
    IgxIconComponent,
    IgxInputDirective,
    IgxInputGroupComponent,
    IgxLabelDirective,
    IgxLayoutDirective,
    IgxSwitchComponent,
    IgxTreeNodeLinkDirective,
    IgxTreeExpandIndicatorDirective
} from 'igniteui-angular';
import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { HIERARCHICAL_SAMPLE_DATA } from '../shared/sample-data';
import { SizeSelectorComponent } from '../size-selector/size-selector.component';
import { CompanyData } from './models/company-data.model';
import { SelectionModeOption } from './models/selection-mode-option.model';
import { TreeDataService } from './services/tree-data.service';
import { TreeSelectionService } from './services/tree-selection.service';
import { TreeDataHelper } from './utils/tree-data.helper';
import { TreeAnimationHelper } from './utils/tree-animation.helper';

@Component({
    selector: 'app-tree-sample',
    templateUrl: 'tree.sample.html',
    styleUrls: ['tree.sample.scss'],
    providers: [TreeDataService, TreeSelectionService],
    imports: [
        IgxLayoutDirective,
        IgxInputGroupComponent,
        IgxInputDirective,
        IgxButtonDirective,
        IgxLabelDirective,
        FormsModule,
        IgxSwitchComponent,
        IgxButtonGroupComponent,
        IgxTreeComponent,
        IgxTreeNodeComponent,
        IgxTreeNodeLinkDirective,
        IgxTreeExpandIndicatorDirective,
        NgTemplateOutlet,
        IgxIconComponent,
        AsyncPipe,
        SizeSelectorComponent
    ]
})
export class TreeSampleComponent implements AfterViewInit {
    @ViewChild('tree1', { static: true })
    public tree: IgxTreeComponent;

    @ViewChild('test', { static: true })
    public testNode: IgxTreeNodeComponent<CompanyData>;

    public selectionModes: SelectionModeOption[] = [];

    public selectionMode = 'Cascading';

    public animationDuration = 400;

    public data: CompanyData[];

    public singleBranchExpand = false;

    public asyncItems = new Subject<CompanyData[]>();
    public loadDuration = 6000;

    private initData: CompanyData[];
    private containsComparer = TreeDataHelper.createContainsComparer();

    constructor(
        private cdr: ChangeDetectorRef,
        private treeDataService: TreeDataService,
        private treeSelectionService: TreeSelectionService
    ) {
        this.selectionModes = [
            { label: 'None', selectMode: 'None', selected: this.selectionMode === 'None', togglable: true },
            { label: 'Multiple', selectMode: 'Multiple', selected: this.selectionMode === 'Multiple', togglable: true },
            { label: 'Cascade', selectMode: 'Cascading', selected: this.selectionMode === 'Cascading', togglable: true }
        ];
        this.data = cloneDeep(HIERARCHICAL_SAMPLE_DATA);
        this.initData = cloneDeep(HIERARCHICAL_SAMPLE_DATA);
        TreeDataHelper.mapData(this.data);
    }

    public setDummy() {
        this.data = this.treeDataService.setDummy();
    }

    public handleNodeExpanding(_event: ITreeNodeTogglingEventArgs) {
        // do something w/ data
    }

    public handleNodeExpanded(_event: ITreeNodeToggledEventArgs) {
        // do something w/ data
    }

    public handleNodeCollapsing(_event: ITreeNodeTogglingEventArgs) {
        // do something w/ data
    }

    public handleNodeCollapsed(_event: ITreeNodeToggledEventArgs) {
        // do something w/ data
    }


    public addDataChild(key: string) {
        this.treeDataService.addDataChild(this.tree, key);
    }

    public deleteLastChild(key: string) {
        this.treeDataService.deleteLastChild(this.tree, key);
    }

    public deleteNodesFromParent(key: string, deleteNodes: string) {
        this.treeDataService.deleteNodesFromParent(this.tree, key, deleteNodes);
    }

    public addSeveralNodes(key: string) {
        this.treeDataService.addSeveralNodes(this.tree, key);
    }

    public handleRemote(node: IgxTreeNodeComponent<CompanyData>, event: boolean) {
        this.treeDataService.handleRemote(node, event, this.asyncItems, this.loadDuration);
    }

    public ngAfterViewInit() {
        this.tree.nodes.toArray().forEach(node => {
            node.selectedChange.subscribe(() => {});
        });
    }

    public toggleSelectionMode() { }

    public addItem() {
        this.data = this.treeDataService.addItem(this.data);
    }

    public resetData() {
        this.data = this.treeDataService.resetData(this.initData);
    }

    public get animationSettings() {
        return TreeAnimationHelper.getAnimationSettings(this.animationDuration);
    }

    public selectSpecific() {
        this.treeSelectionService.selectSpecific(this.tree);
    }

    public selectAll() {
        this.treeSelectionService.selectAll(this.tree);
    }

    public deselectSpecific() {
        this.treeSelectionService.deselectSpecific(this.tree);
    }

    public deselectAll() {
        this.treeSelectionService.deselectAll(this.tree);
    }

    public changeNodeSelectionState() {
        this.treeSelectionService.changeNodeSelectionState(this.tree);
    }

    public changeNodeData() {
        this.treeSelectionService.changeNodeData(this.tree);
    }

    public nodeSelection(event: ITreeNodeSelectionEvent) {
        // console.log(event);
        if (event.newSelection.find(x => x.data.ID === 'igxTreeNode_1')) {
            //event.newSelection = [...event.newSelection, this.tree.nodes.toArray()[0]];
        }
    }

    public customSearch(term: string) {
        const searchResult = this.tree.findNodes(term, this.containsComparer);
        // console.log(searchResult);
        return searchResult;
    }

    public activeNodeChanged(_event: IgxTreeNode<CompanyData>) {
        // active node changed
    }

    public keydown(_event: KeyboardEvent) {
        // console.log(evt);
    }

}
