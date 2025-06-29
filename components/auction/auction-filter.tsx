"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AuctionType } from "@/lib/mock-data";

interface AuctionFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: AuctionType[];
  setSelectedTypes: (types: AuctionType[]) => void;
  selectedStatus: string[];
  setSelectedStatus: (status: string[]) => void;
}

export function AuctionFilter({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  selectedStatus,
  setSelectedStatus,
}: AuctionFilterProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const auctionTypes: { value: AuctionType; label: string }[] = [
    { value: "English", label: "English" },
    { value: "Linear", label: "Linear" },
    { value: "Exponential", label: "Exponential" },
    { value: "Logarithmic", label: "Logarithmic" },
    { value: "AllPay", label: "AllPay" },
    { value: "Vickrey", label: "Vickrey" },
  ];
  
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "ended", label: "Ended" },
  ];

  const handleTypeToggle = (type: AuctionType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleStatusToggle = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatus([]);
  };

  const hasActiveFilters =
    selectedTypes.length > 0 || selectedStatus.length > 0;

  // Filter content component to reuse in both popover and sheet
  const FilterContent = () => (
    <div className="grid gap-4">
      <div className="space-y-4">
        <h3 className="font-medium">Auction Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {auctionTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => handleTypeToggle(type.value)}
              />
              <Label
                htmlFor={`type-${type.value}`}
                className="text-sm cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Status</h3>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map((status) => (
            <div key={status.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status.value}`}
                checked={selectedStatus.includes(status.value)}
                onCheckedChange={() => handleStatusToggle(status.value)}
              />
              <Label
                htmlFor={`status-${status.value}`}
                className="text-sm cursor-pointer"
              >
                {status.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={clearFilters}
        disabled={!hasActiveFilters}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search auctions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter popover for larger screens */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "hidden sm:flex",
              hasActiveFilters && "bg-primary/5 border-primary/20"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <Badge className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                {selectedTypes.length + selectedStatus.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <FilterContent />
        </PopoverContent>
      </Popover>

      {/* Filter sheet for mobile */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "sm:hidden w-full",
              hasActiveFilters && "bg-primary/5 border-primary/20"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <Badge className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                {selectedTypes.length + selectedStatus.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Filter Auctions</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedTypes.map((type) => (
            <Badge
              key={`type-${type}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTypeToggle(type)}
              />
            </Badge>
          ))}
          {selectedStatus.map((status) => (
            <Badge
              key={`status-${status}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusToggle(status)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
