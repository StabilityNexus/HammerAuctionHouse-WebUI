"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface TokenObject {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
}

export interface TokenPickerProps {
  selected?: TokenObject | null;
  onSelect: (token: TokenObject) => void;
  placeholder?: string;
  dataUrl?: string;
  maxResults?: number;
  className?: string;
  disabled?: boolean;
}

// Custom hook for token search with debouncing and caching
function useTokenSearch(dataUrl = "/data/tokens.json", maxResults?: number) {
  const [tokens, setTokens] = useState<TokenObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Cache for tokens to avoid refetching
  const tokensCache = React.useRef<TokenObject[] | null>(null);

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch tokens on mount
  useEffect(() => {
    if (tokensCache.current) {
      setTokens(tokensCache.current);
      setLoading(false);
      return;
    }

    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch tokens: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        tokensCache.current = data;
        setTokens(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [dataUrl]);

  // Filter tokens with prioritized results
  const filteredTokens = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return maxResults ? tokens.slice(0, maxResults) : tokens;
    }

    const lowerQuery = debouncedQuery.toLowerCase();

    // Categorize matches by priority
    const exactSymbol: TokenObject[] = [];
    const startsWithSymbol: TokenObject[] = [];
    const startsWithName: TokenObject[] = [];
    const includesSymbol: TokenObject[] = [];
    const includesName: TokenObject[] = [];
    const addressMatch: TokenObject[] = [];

    tokens.forEach((token) => {
      const lowerName = token.name.toLowerCase();
      const lowerSymbol = token.symbol.toLowerCase();
      const lowerAddress = token.address.toLowerCase();

      // Exact symbol match (highest priority)
      if (lowerSymbol === lowerQuery) {
        exactSymbol.push(token);
        return;
      }

      // Address match
      if (lowerAddress.includes(lowerQuery)) {
        addressMatch.push(token);
        return;
      }

      // Starts with matches
      if (lowerSymbol.startsWith(lowerQuery)) {
        startsWithSymbol.push(token);
        return;
      }

      if (lowerName.startsWith(lowerQuery)) {
        startsWithName.push(token);
        return;
      }

      // Includes matches
      if (lowerSymbol.includes(lowerQuery)) {
        includesSymbol.push(token);
        return;
      }

      if (lowerName.includes(lowerQuery)) {
        includesName.push(token);
        return;
      }
    });

    // Combine results in priority order
    const results = [
      ...exactSymbol,
      ...startsWithSymbol,
      ...startsWithName,
      ...includesSymbol,
      ...includesName,
      ...addressMatch,
    ];

    return maxResults ? results.slice(0, maxResults) : results;
  }, [tokens, debouncedQuery, maxResults]);

  return {
    tokens,
    filteredTokens,
    loading,
    error,
    query,
    setQuery,
  };
}

// Highlight matched text component
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="bg-primary/10 text-primary rounded px-0.5 font-medium"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

// Token item component
function TokenItem({
  token,
  query,
  isSelected,
  onSelect,
}: {
  token: TokenObject;
  query: string;
  isSelected: boolean;
  onSelect: (token: TokenObject) => void;
}) {
  return (
    <motion.button
      onClick={() => onSelect(token)}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
        "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30",
        "group relative overflow-hidden",
        isSelected && "bg-primary/5 ring-1 ring-primary/20"
      )}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <Avatar className="w-10 h-10 ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-105">
        <AvatarImage
          src={token.icon || "/placeholder.svg"}
          alt={`${token.name} icon`}
        />
        <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
          {token.symbol.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium truncate">
            <HighlightMatch text={token.name} query={query} />
          </span>
          <Badge
            variant="secondary"
            className="bg-muted/50 hover:bg-muted/50 text-xs font-medium"
          >
            <HighlightMatch text={token.symbol.toUpperCase()} query={query} />
          </Badge>
        </div>
        <div className="text-muted-foreground text-sm font-mono truncate opacity-80">
          {token.address.slice(0, 8)}...{token.address.slice(-6)}
        </div>
      </div>

      {isSelected && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary absolute right-4 opacity-80" />
      )}

      <motion.div
        className="absolute inset-0 bg-primary/5 pointer-events-none"
        initial={false}
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}

// Main TokenPicker component
export function TokenPicker({
  selected,
  onSelect,
  placeholder = "Search tokens",
  dataUrl = "/data/tokens.json",
  maxResults,
  className,
  disabled = false,
}: TokenPickerProps) {
  const [open, setOpen] = useState(false);
  const { filteredTokens, loading, error, query, setQuery } = useTokenSearch(
    dataUrl,
    maxResults
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset query when modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open, setQuery]);

  const handleSelect = (token: TokenObject) => {
    onSelect(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-12 px-4 justify-between bg-background/50 hover:bg-background/80 backdrop-blur-sm",
            "border border-border/50 hover:border-border/80 transition-all duration-300",
            "shadow-sm hover:shadow-md hover:shadow-primary/5",
            className
          )}
        >
          {selected ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-6 h-6 ring-1 ring-border/50">
                <AvatarImage
                  src={selected.icon || "/placeholder.svg"}
                  alt={`${selected.name} icon`}
                />
                <AvatarFallback className="text-xs font-medium bg-muted">
                  {selected.symbol.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="font-medium">{selected.symbol}</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">
                  {selected.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Coins className="w-5 h-5" />
              <span>Select Token</span>
            </div>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50 p-0 shadow-lg shadow-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              Select Token
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 h-12 bg-muted/50 border-border/50 placeholder:text-muted-foreground 
                          focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 
                           text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-muted-foreground text-sm">
                    Loading tokens...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3 text-destructive">
                  <AlertCircle className="w-8 h-8" />
                  <span className="text-sm">Failed to load tokens</span>
                  <span className="text-xs text-muted-foreground">{error}</span>
                </div>
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Search className="w-8 h-8 opacity-50" />
                  <span className="text-sm">No tokens found</span>
                  {query && (
                    <span className="text-xs">Try a different search term</span>
                  )}
                </div>
              </div>
            ) : (
              <ScrollArea className="h-80">
                <div className="space-y-1 p-2">
                  <AnimatePresence>
                    {filteredTokens.map((token, index) => (
                      <motion.div
                        key={token.address}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <TokenItem
                          token={token}
                          query={query}
                          isSelected={selected?.address === token.address}
                          onSelect={handleSelect}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Results count for screen readers */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {filteredTokens.length} tokens found
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default TokenPicker;
