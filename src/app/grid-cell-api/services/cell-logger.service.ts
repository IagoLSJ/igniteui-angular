import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { CellType } from 'igniteui-angular';
import { GridComponentType } from '../types/grid-type.union';

@Injectable()
export class CellLoggerService {
    private renderer: Renderer2;

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    public clearLog(logger: HTMLElement): void {
        const elements = logger.querySelectorAll('p');
        elements.forEach((element: Element) => {
            this.renderer.removeChild(logger, element);
        });
    }

    public logState(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        this.clearLog(logger);
        const cell = grid.getCellByColumn(parseInt(rIndex, 10), field);
        const states = this.buildCellStateArray(cell);

        this.renderCellStates(states, logger);
    }

    public logStateByKey(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        this.clearLog(logger);
        const cell = grid.getCellByColumn(parseInt(rIndex, 10), field);
        const states = this.buildCellStateArray(cell);

        this.renderCellStates(states, logger);
    }

    public logStateByColumn(
        grid: GridComponentType,
        rowIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        this.clearLog(logger);
        const cell = grid.getCellByColumn(parseInt(rowIndex, 10), field);
        const states = this.buildCellStateArray(cell);

        this.renderCellStates(states, logger);
    }

    private buildCellStateArray(cell: CellType | null): string[] {
        if (!cell) {
            return [`Cell is: ${cell}`];
        }

        const state = `
                value: ${cell.value},
                selected: ${cell.selected},
                editable: ${cell.editable},
                editMode: ${cell.editMode},
                editValue: ${cell.editValue},
                -----------------------------,
                colIndex: ${cell.column.index},
                visibleColIndex: ${cell.column.visibleIndex},
                colField: ${cell.column.field},
                -----------------------------,
                rowIndex: ${cell.row.index},
                rowViewIndex: ${cell.row.viewIndex},
                rowKey: ${cell.row.key},
                rowData: ${cell.row.data},
                -----------------------------,
                gridId: ${cell.grid.id},
                id: ${cell.id},
                width: ${cell.width}`;

        return state.split(',');
    }

    private renderCellStates(states: string[], logger: HTMLElement): void {
        const createElem = this.renderer.createElement('p');

        states.forEach((st: string) => {
            const text = this.renderer.createText(st);
            this.renderer.appendChild(createElem, text);
            this.renderer.appendChild(createElem, this.renderer.createElement('br'));
        });

        this.renderer.insertBefore(logger, createElem, logger.children[0]);
    }
}

