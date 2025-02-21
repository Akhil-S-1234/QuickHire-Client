'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import axiosInstance from '../../lib/axiosInstance'

// Types
export interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  key?: string // Used for sorting if accessor is a function
  sortable?: boolean
  renderCell?: (item: T) => React.ReactNode
  filterOptions?: string[] | { value: string, label: string }[]
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface FilterConfig {
  [key: string]: string[] | string | boolean
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
  indexOfFirstItem: number
  indexOfLastItem: number
  onItemsPerPageChange: (count: number) => void
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  fetchUrl: string
  searchPlaceholder?: string
  defaultItemsPerPage?: number
  itemsPerPageOptions?: number[]
  onRowClick?: (item: T) => void
  defaultSortConfig?: SortConfig
  transformResponse?: (data: any) => {
    data: T[],
    meta: { total: number }
  }
}

// Pagination Component
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
  onItemsPerPageChange
}: PaginationProps) {
  return (
    <div className="px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
      <div className="flex items-center space-x-2 mb-3 sm:mb-0">
        <span className="text-sm text-gray-700">Show</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="w-16 h-8">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-700">items per page</span>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto">
        <div className="mb-3 sm:mb-0 sm:mr-8">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed h-9"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            {totalPages <= 7 ? (
              // Show all pages if 7 or fewer
              [...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium h-9 w-9 ${
                    currentPage === index + 1
                      ? 'z-10 bg-primary border-primary text-primary-foreground'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </Button>
              ))
            ) : (
              // Show first, last, and pages around current
              <>
                {/* First page */}
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium h-9 w-9 ${
                    currentPage === 1
                      ? 'z-10 bg-primary border-primary text-primary-foreground'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  1
                </Button>

                {/* Ellipsis or second page */}
                {currentPage > 3 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}

                {/* Pages around current */}
                {Array.from(
                  { length: Math.min(3, totalPages - 2) },
                  (_, i) => {
                    let pageNum;
                    if (currentPage <= 2) {
                      pageNum = i + 2;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 3 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    // Only render if within bounds
                    if (pageNum > 1 && pageNum < totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium h-9 w-9 ${
                            currentPage === pageNum
                              ? 'z-10 bg-primary border-primary text-primary-foreground'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  }
                )}

                {/* Ellipsis or second-to-last page */}
                {currentPage < totalPages - 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}

                {/* Last page */}
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium h-9 w-9 ${
                    currentPage === totalPages
                      ? 'z-10 bg-primary border-primary text-primary-foreground'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed h-9"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}

// Main DataTable Component
export function DataTable<T extends { id: string }>({
  columns,
  fetchUrl,
  searchPlaceholder = "Search...",
  defaultItemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 25, 50],
  onRowClick,
  defaultSortConfig,
  transformResponse
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  const [isLoading, setIsLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSortConfig || null)
  const [activeFilters, setActiveFilters] = useState<FilterConfig>({})
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("")
  
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch data with all parameters
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Build URL with query params
        let url = new URL(fetchUrl, window.location.origin);
        
        // Add pagination parameters
        url.searchParams.append('page', currentPage.toString());
        url.searchParams.append('limit', itemsPerPage.toString());
        
        // Add search parameter if exists
        if (delayedSearchTerm) {
          url.searchParams.append('search', delayedSearchTerm);
        }
        
        // Add sorting if defined
        if (sortConfig) {
          url.searchParams.append('sort', sortConfig.key);
          url.searchParams.append('order', sortConfig.direction);
        }
        
        // Add filters
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            // Handle array values for multi-select filters
            value.forEach(v => url.searchParams.append(`filter[${key}][]`, v));
          } else if (typeof value === 'boolean') {
            // Handle boolean filters
            url.searchParams.append(`filter[${key}]`, value.toString());
          } else if (value && typeof value === 'string') {
            // Handle string values
            url.searchParams.append(`filter[${key}]`, value);
          }
        });
        
        const response = await axiosInstance.get(url.pathname + url.search);
        
        if (transformResponse) {
          const transformed = transformResponse(response.data);
          setData(transformed.data);
          setTotalItems(transformed.meta.total);
        } else if (response.data.data && response.data.meta) {
          // Standard API response format
          setData(response.data.data);
          setTotalItems(response.data.meta.total);
        } else {
          // Fallback for simple API
          setData(response.data);
          setTotalItems(response.data.length);
        }
      } catch (error) {
        console.error(`Error fetching data from ${fetchUrl}:`, error);
        setData([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [fetchUrl, currentPage, itemsPerPage, delayedSearchTerm, sortConfig, activeFilters, transformResponse]);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    setSortConfig(prevSort => {
      if (prevSort && prevSort.key === columnKey) {
        // Toggle direction if same column
        return {
          key: columnKey,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      // Default to ascending for new column
      return {
        key: columnKey,
        direction: 'asc'
      };
    });
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | string[] | boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Clear a specific filter
  const clearFilter = (key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, totalItems);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Change items per page
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Get sort icon for column header
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    const sortKey = typeof column.accessor === 'string' ? column.accessor.toString() : column.key;
    if (!sortKey) return null;
    
    if (sortConfig && sortConfig.key === sortKey) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="h-4 w-4 ml-1" /> : 
        <ChevronDown className="h-4 w-4 ml-1" />;
    }
    
    return <ChevronDown className="h-4 w-4 ml-1 opacity-20" />;
  };

  // Render filter badges
  const renderFilterBadges = () => {
    if (Object.keys(activeFilters).length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        {Object.entries(activeFilters).map(([key, value]) => {
          // Find the column that this filter belongs to
          const column = columns.find(col => 
            typeof col.accessor === 'string' && col.accessor === key || 
            col.key === key
          );
          
          if (!column) return null;
          
          const displayName = column.header;
          
          // Render different badge formats based on value type
          if (Array.isArray(value) && value.length) {
            return value.map((v, idx) => (
              <Badge key={`${key}-${idx}`} variant="outline" className="px-2 py-1 gap-1 border-primary/20">
                {`${displayName}: ${v}`}
                <X 
                  className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                  onClick={() => {
                    const newValues = (activeFilters[key] as string[]).filter(item => item !== v);
                    if (newValues.length === 0) {
                      clearFilter(key);
                    } else {
                      handleFilterChange(key, newValues);
                    }
                  }}
                />
              </Badge>
            ));
          } else if (typeof value === 'boolean') {
            return (
              <Badge key={key} variant="outline" className="px-2 py-1 gap-1 border-primary/20">
                {`${displayName}: ${value ? 'Yes' : 'No'}`}
                <X 
                  className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                  onClick={() => clearFilter(key)}
                />
              </Badge>
            );
          } else if (value) {
            return (
              <Badge key={key} variant="outline" className="px-2 py-1 gap-1 border-primary/20">
                {`${displayName}: ${value}`}
                <X 
                  className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                  onClick={() => clearFilter(key)}
                />
              </Badge>
            );
          }
          
          return null;
        })}
        
        {Object.keys(activeFilters).length > 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs" 
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 py-2 text-sm"
            />
          </div>
          
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filter</span>
                  {Object.keys(activeFilters).length > 0 && (
                    <Badge className="ml-1 h-5 px-1">{Object.keys(activeFilters).length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4">
                <h3 className="font-medium mb-3">Filters</h3>
                <div className="space-y-4">
                  {columns.filter(col => !!col.filterOptions).map((column, i) => {
                    const key = typeof column.accessor === 'string' ? column.accessor.toString() : column.key;
                    if (!key || !column.filterOptions) return null;
                    
                    // Determine if filter options are simple strings or objects with label/value
                    const options = column.filterOptions.map(opt => 
                      typeof opt === 'string' ? { label: opt, value: opt } : opt
                    );
                    
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium">{column.header}</label>
                        <Select
                          value={
                            activeFilters[key] && typeof activeFilters[key] === 'string' 
                              ? activeFilters[key] as string 
                              : ''
                          }
                          onValueChange={(value) => handleFilterChange(key, value)}
                        >
                          <SelectTrigger className="w-full h-8 text-sm">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any</SelectItem>
                            {options.map((opt, idx) => (
                              <SelectItem key={idx} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                  
                  {columns.filter(col => !!col.filterOptions).length === 0 && (
                    <p className="text-sm text-muted-foreground">No filters available</p>
                  )}
                </div>
                
                {Object.keys(activeFilters).length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-4 w-full" 
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {renderFilterBadges()}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {columns.map((column, index) => {
                // Determine sortable status and sort key
                const sortable = !!column.sortable;
                const sortKey = typeof column.accessor === 'string' ? column.accessor.toString() : column.key;
                
                return (
                  <TableHead 
                    key={index} 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      sortable && sortKey ? 'cursor-pointer select-none' : ''
                    }`}
                    onClick={() => {
                      if (sortable && sortKey) {
                        handleSort(sortKey);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {getSortIcon(column)}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-6 w-6 border-2 border-t-primary rounded-full animate-spin"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow 
                  key={item.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, index) => (
                    <TableCell key={index} className="px-6 py-4 whitespace-nowrap">
                      {column.renderCell 
                        ? column.renderCell(item)
                        : typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : (item[column.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  )
}