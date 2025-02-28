"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const LAZY_ADDRESS = "0x3924d7fe9f8a07753fcdc7192b36c58c238b61a6";


const tokens = [
    { 
        value: ETH_ADDRESS, 
        label: "ETH",
        image: "/images/ethereum-eth-logo.png"

    },
    { 
        value: LAZY_ADDRESS, 
        label: "LAZY",
        image: "/images/lzytoken.png"  // Make sure to add this image
    }
];

interface TokenListProps {
    selectedAddress: string;
    onSelect: (address: string) => void;
}

export function TokenList({ selectedAddress, onSelect }: TokenListProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    
    const selectedToken = tokens.find(token => token.value === selectedAddress);

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between border"
                    >
                        <div className="flex gap-1">
                            <Image 
                                src={selectedToken?.image || "/images/ethereum-eth-logo.png"} 
                                alt={selectedToken?.label || "eth"} 
                                width={20} 
                                height={20} 
                            />
                            <p>{selectedToken?.label || "ETH"}</p>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search Token" />
                        <CommandList>
                            <CommandEmpty>No tokens found.</CommandEmpty>
                            <CommandGroup>
                                {tokens.map((token) => (
                                    <CommandItem
                                        key={token.value}
                                        value={token.label}
                                        onSelect={() => {
                                            onSelect(token.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedAddress === token.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <Image 
                                                src={token.image} 
                                                alt={token.label} 
                                                width={20} 
                                                height={20} 
                                            />
                                            {token.label}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}