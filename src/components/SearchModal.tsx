import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, FileText, Wrench, Building2, Plug, FileSearch } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { searchIndex, SearchItem } from "@/data/searchIndex";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons = {
  page: FileSearch,
  article: FileText,
  tool: Wrench,
  industry: Building2,
  integration: Plug,
};

const categoryLabels = {
  page: "Pages",
  article: "Articles",
  tool: "Tools & Calculators",
  industry: "Industries",
  integration: "Integrations",
};

export const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const navigate = useNavigate();

  // Filter results based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = searchIndex.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descriptionMatch = item.description.toLowerCase().includes(query);
      const keywordMatch = item.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(query)
      );
      return titleMatch || descriptionMatch || keywordMatch;
    });

    setFilteredResults(results.slice(0, 10)); // Limit to 10 results
  }, [searchQuery]);

  const handleSelect = useCallback(
    (url: string) => {
      onOpenChange(false);
      setSearchQuery("");
      navigate(url);
    },
    [navigate, onOpenChange]
  );

  // Group results by category
  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search pages, articles, tools, industries..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {!searchQuery.trim() && (
          <div className="py-8 px-4 text-center text-sm text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Type to search across all content</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        )}

        {searchQuery.trim() && filteredResults.length === 0 && (
          <CommandEmpty>
            <div className="py-6 text-center">
              <FileSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords
              </p>
            </div>
          </CommandEmpty>
        )}

        {Object.entries(groupedResults).map(([category, items], index) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const label = categoryLabels[category as keyof typeof categoryLabels];

          return (
            <div key={category}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={label}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.url)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
};
