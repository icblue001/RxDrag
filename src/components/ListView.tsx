import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import { Data, ListViewHead } from './ListViewHead';
import ListViewToolbar from './ListViewToolbar';
import { ListViewMetaItem } from './ListViewMetaItem';
import intl from 'react-intl-universal';
import { PageActionHandle } from 'admin/views/Page/PageAction';

type Order = 'asc' | 'desc';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },

  }),
);

export interface Paginate{
  total:number,
  per_page:number,
  current_page:number,
  last_page:number,
  from:number,
  to:number,
  data:Array<unknown>,
}

export interface ListViewForm{
  page:number,
  rowsPerPage:number,
  keyword:string,
  filters:Array<string>,
  sortBy:Array<string>
}

const ListView = React.forwardRef((
    props: {
      className:string, 
      value?:Paginate, 
      columns:Array<ListViewMetaItem>, 
      filters:Array<ListViewMetaItem>,
      batchActions:Array<ListViewMetaItem>,
      rowActions:Array<ListViewMetaItem>,
      rowsPerPageOptions:string,
      defalutRowsPerPage:number,
      onAction: PageActionHandle,
    }, 
    ref:any
  )=>{

  const {
    className, 
    value, 
    columns, 
    filters, 
    rowActions, 
    batchActions, 
    rowsPerPageOptions = "10,25,50", 
    defalutRowsPerPage = 10, 
    onAction,
    ...rest
  } = props
  
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(defalutRowsPerPage.toString()));
  const [keyword, setKeyword] = React.useState('');
  const [selectedFilters, setSelectedFilters] = React.useState([]);
  const [sortBy, setSortBy] = React.useState([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');

  //const [queryForm, setQueryForm] = React.useState<ListViewForm>({
  //  page: 0,
  //  rowsPerPage: defalutRowsPerPage,
  //  keyword: '',
  //  filters:[],
  //  sortBy:[]    
  //});
  const [selected, setSelected] = React.useState<string[]>([]);
  const rows: any[] = value&& value.data? value.data : [];
  const [filterValues, setFilterValues] = React.useState({});


  const parseRowsPerPageOptions = ()=>{
    let ret: number[] = [];
    rowsPerPageOptions?.replace('，',',').split(',').forEach(i=>{
      ret.push(parseInt(i));
    })
    return ret;
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    //const isAsc = orderBy === property && order === 'asc';
    //setOrder(isAsc ? 'desc' : 'asc');
    //setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleKeywordChange = (keyword:string)=>{
    setKeyword(keyword);
    //读取数据
    console.log('关键词变化')
  }

  const handleFilterChange = (values:any)=>{
    setFilterValues(values);
    //读取数据
    console.log('过滤器变化', values)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    //读取数据
    console.log('handleChangePage',newPage)
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    let pageRows = parseInt(event.target.value, 10)
    console.log('handleChangeRowsPerPage', pageRows) 
    setRowsPerPage(pageRows);
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classNames(classes.root, className)} {...rest} ref={ref}>
      <Paper>
        <ListViewToolbar
          keyword = {keyword}
          numSelected={selected.length}
          filters = {filters}
          batchActions = {batchActions}
          filterValues = {filterValues}
          onFilterChange = {handleFilterChange}
          onKeywordChange = {handleKeywordChange}
        />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <ListViewHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              columns = {columns}
            />
            <TableBody>
              {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `listview-${index}`;
                  return (
                    <TableRow
                      hover
                      id={row.id}
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          id = {row.id}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      {
                        columns.map((column, colIndex) => {
                          return(
                            <TableCell key={row.id + '-' + colIndex + '-' + column.field} {... column.props} 
                            dangerouslySetInnerHTML={{__html: row[column.field]}} >
                            </TableCell>
                          )
                        })
                      }
                    </TableRow>
                  );
                })}
              {/*emptyRows > 0 && (
                <TableRow style={{ height: (53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )*/}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={parseRowsPerPageOptions()}
          component="div"
          labelRowsPerPage = {intl.get('rows-per-page') + ':'}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            //native: true,
            id:'pagination',
          }}
        />
      </Paper>
    </div>
  );
})

export default ListView;

