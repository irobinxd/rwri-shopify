<?php

namespace App\DataTables;

use App\Models\Role;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Services\DataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;

class RolesDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder $query Results from query() method.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('action', function (Role $role) {
                return view('pages.apps.user-management.roles.columns._actions', compact('role'));
            })
            ->addColumn('status', function (Role $role) {
                return '<span class="badge badge-success">Active</span>';
            })
            ->editColumn('name', function (Role $role) {
                return ucwords($role->name);
            })
            ->rawColumns(['action', 'status'])
            ->setRowId('id');
    }

    /**
     * Get the query source of dataTable.
     */
    public function query(Role $model): QueryBuilder
    {
        // Get all roles - don't filter by guard_name to get all roles
        return Role::query();
    }

    /**
     * Optional method if you want to use html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('roles-table')
            ->columns($this->getColumns())
            ->minifiedAjax(route('user-management.roles.index'))
            ->dom("<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'f>>rt<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>")
            ->addTableClass('table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer')
            ->setTableHeadClass('text-start text-muted fw-bold fs-7 text-uppercase gs-0')
            ->orderBy(0, 'desc')
            ->pageLength(10)
            ->drawCallback("function() {" . (file_exists(resource_path('views/pages/apps/user-management/roles/columns/_draw-scripts.js')) ? file_get_contents(resource_path('views/pages/apps/user-management/roles/columns/_draw-scripts.js')) : '') . "}");
    }

    /**
     * Get the dataTable columns definition.
     */
    public function getColumns(): array
    {
        return [
            Column::make('id')->title('Role ID')->width('100px'),
            Column::make('name')->title('Title')->width('200px'),
            Column::computed('status')->title('Status')->width('100px')->orderable(false)->searchable(false),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(60)
                ->addClass('text-end'),
        ];
    }

    /**
     * Get the filename for export.
     */
    protected function filename(): string
    {
        return 'Roles_' . date('YmdHis');
    }
}

