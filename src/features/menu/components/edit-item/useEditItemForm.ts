"use client";

import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ImageSearchResponse, MenuItem, MenuItemAddon, MenuItemVariant } from "@/types";
import type {
  CustomCharge,
  EditItemModalProps,
  FoodType,
  PhotoTab,
  VariantPropertyItem,
  VariantStep,
  VariantTemplate,
} from "./types";

const SUGGESTED_SEARCHES = [
  "chicken",
  "biryani",
  "pizza",
  "burger",
  "dessert",
  "coffee",
  "salad",
  "pasta",
] as const;

function variantTemplateDefaults(type: VariantTemplate): {
  propName: string;
  defaultOpts: string[];
} {
  switch (type) {
    case "Size":
      return { propName: "Size", defaultOpts: ["Small", "Medium", "Large"] };
    case "Quantity":
      return { propName: "Quantity", defaultOpts: ["Quarter", "Half", "Full"] };
    case "PrepType":
      return { propName: "Preparation Type", defaultOpts: ["Halal", "Non-halal"] };
    case "Base":
      return { propName: "Base", defaultOpts: ["Thin crust", "Thick crust"] };
  }
}

function filterVariantProperties(props: VariantPropertyItem[]): VariantPropertyItem[] {
  return props
    .map((p) => ({ ...p, options: p.options.filter((o) => o.trim() !== "") }))
    .filter((p) => p.name.trim() !== "" && p.options.length > 0);
}

export function useEditItemForm({
  item,
  categories,
  categorySubcategories = {},
  onSave,
  addonGroups,
  setAddonGroups,
}: EditItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [serviceType, setServiceType] = useState("Delivery");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isCreatingNewSubcategory, setIsCreatingNewSubcategory] = useState(false);
  const [image, setImage] = useState("");
  const [packagingCharge, setPackagingCharge] = useState<number>(0);
  const [variants, setVariants] = useState<MenuItemVariant[]>([]);
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(true);
  const [isAddonsExpanded, setIsAddonsExpanded] = useState(false);
  const [customChargesList, setCustomChargesList] = useState<CustomCharge[]>([]);
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);
  const [newChargeName, setNewChargeName] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState<number>(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoTab, setPhotoTab] = useState<PhotoTab>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [selectedStockImage, setSelectedStockImage] = useState("");
  const [searchResults, setSearchResults] = useState<ImageSearchResponse["images"]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageSearchError, setImageSearchError] = useState<string | null>(null);
  const defaultVariantPropId = useId();
  const [isCreatingVariantInline, setIsCreatingVariantInline] = useState(false);
  const [variantStep, setVariantStep] = useState<VariantStep>(1);
  const [variantProperties, setVariantProperties] = useState<VariantPropertyItem[]>([
    { id: `prop_${defaultVariantPropId}`, name: "Size", options: ["Small", "Medium", "Large"] },
  ]);
  const [variantPrices, setVariantPrices] = useState<Record<string, Record<string, number>>>({});
  const [searchAddonQuery, setSearchAddonQuery] = useState("");
  const [selectedAddonGroupIds, setSelectedAddonGroupIds] = useState<string[]>([]);
  const [showAddAddonGroupModal, setShowAddAddonGroupModal] = useState(false);
  const [newAddonGroupName, setNewAddonGroupName] = useState("");
  const [newAddonGroupOptionsText, setNewAddonGroupOptionsText] = useState<string[]>([
    "Option 1",
    "Option 2",
  ]);
  const [newAddonGroupPrices, setNewAddonGroupPrices] = useState<Record<string, number>>({});
  const [editingAddonGroupId, setEditingAddonGroupId] = useState<string | null>(null);
  const [newInlineAddonName, setNewInlineAddonName] = useState("");
  const [newInlineAddonPrice, setNewInlineAddonPrice] = useState<number>(0);

  const subcategoryOptions = useMemo(
    () => categorySubcategories[category] || [],
    [categorySubcategories, category],
  );

  const filteredAddonGroups = useMemo(() => {
    if (!searchAddonQuery.trim()) return addonGroups;
    const query = searchAddonQuery.toLowerCase();
    return addonGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.options.some((opt) => opt.name.toLowerCase().includes(query)),
    );
  }, [searchAddonQuery, addonGroups]);

  const mappedAddons = useMemo(() => {
    const result: MenuItemAddon[] = [];
    for (const group of addonGroups) {
      if (selectedAddonGroupIds.includes(group.id)) {
        result.push(...group.options);
      }
    }
    return result;
  }, [selectedAddonGroupIds, addonGroups]);

  useEffect(() => {
    const query = imageSearchQuery.trim();
    if (query.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearchingImages(true);
      setImageSearchError(null);
      try {
        const res = await fetch(`/api/images/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as ImageSearchResponse;
        if (!res.ok) throw new Error(data.error ?? "Search failed");
        setSearchResults(data.images ?? []);
        if ((data.images ?? []).length === 0 && data.error) {
          setImageSearchError(data.error);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSearchResults([]);
        setImageSearchError("Could not fetch images. Please try again.");
      } finally {
        setIsSearchingImages(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [imageSearchQuery]);

  /* eslint-disable react-hooks/set-state-in-effect -- reset local form state when item/categories change */
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || "");
      setPrice(item.price);
      setFoodType(item.foodType);
      setServiceType(item.serviceType || "Delivery");
      setCategory(item.category);
      const initialSub = item.subcategory || "";
      setSubcategory(initialSub);
      const subList = categorySubcategories[item.category] || [];
      setIsCreatingNewSubcategory(Boolean(initialSub && !subList.includes(initialSub)));
      setImage(item.image);
      setPackagingCharge(item.packagingCharge || 0);
      setVariants(item.variants || []);
      if (item.packagingCharge && item.packagingCharge > 0) {
        const packagingAmount = item.packagingCharge;
        setCustomChargesList((prev) => {
          if (prev.some((c) => c.amount === packagingAmount)) return prev;
          return [
            ...prev,
            {
              id: `charge_${Date.now()}`,
              name: `Charge (₹${packagingAmount})`,
              amount: packagingAmount,
            },
          ];
        });
      }
      const matchedGroupIds: string[] = [];
      for (const group of addonGroups) {
        const hasMatch = group.options.some((opt) => item.addons?.some((a) => a.id === opt.id));
        if (hasMatch) matchedGroupIds.push(group.id);
      }
      setSelectedAddonGroupIds(matchedGroupIds);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setFoodType("veg");
      setServiceType("Delivery");
      setCategory(categories[0] || "Litti Chokha");
      setSubcategory("");
      setIsCreatingNewSubcategory(false);
      setImage("");
      setPackagingCharge(0);
      setVariants([]);
      setSelectedAddonGroupIds([]);
    }
    setIsCreatingVariantInline(false);
    setVariantStep(1);
    setIsVariantsExpanded(true);
    setIsAddonsExpanded(false);
    setEditingAddonGroupId(null);
    setImageSearchQuery("");
    setSearchResults([]);
    setImageSearchError(null);
  }, [item, categories, addonGroups, categorySubcategories]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setImage(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (): void => {
    if (!name.trim()) return;
    const finalItem: MenuItem = {
      id: item?.id || `item_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      price: price || 0,
      foodType,
      serviceType,
      category,
      subcategory: subcategory || undefined,
      inStock: item ? item.inStock : true,
      image,
      packagingCharge: packagingCharge || undefined,
      customisable: variants.length > 0 || mappedAddons.length > 0,
      variants: variants.length > 0 ? variants : undefined,
      addons: mappedAddons.length > 0 ? mappedAddons : undefined,
    };
    onSave(finalItem);
  };

  const handleCreateCharge = (): void => {
    if (!newChargeName.trim() || newChargeAmount <= 0) return;
    const newCharge: CustomCharge = {
      id: `charge_${Date.now()}`,
      name: `${newChargeName.trim()} (₹${newChargeAmount})`,
      amount: newChargeAmount,
    };
    setCustomChargesList((prev) => [...prev, newCharge]);
    setPackagingCharge(newChargeAmount);
    setShowAddChargeModal(false);
    setNewChargeName("");
    setNewChargeAmount(0);
  };

  const handleSelectTemplate = (type: VariantTemplate): void => {
    setVariantStep(1);
    const { propName, defaultOpts } = variantTemplateDefaults(type);
    setVariantProperties([{ id: `prop_${Date.now()}`, name: propName, options: defaultOpts }]);
    setIsCreatingVariantInline(true);
  };

  const handleAddNewPropertyBlock = (): void => {
    const newProp: VariantPropertyItem = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: `Variant ${variantProperties.length + 1}`,
      options: ["Option 1", "Option 2"],
    };
    setVariantProperties([...variantProperties, newProp]);
  };

  const handleRemovePropertyBlock = (id: string): void => {
    setVariantProperties(variantProperties.filter((p) => p.id !== id));
  };

  const handlePropertyNameChange = (id: string, nameVal: string): void => {
    setVariantProperties(variantProperties.map((p) => (p.id === id ? { ...p, name: nameVal } : p)));
  };

  const handleAddOptionToProperty = (propId: string): void => {
    setVariantProperties(
      variantProperties.map((p) => (p.id === propId ? { ...p, options: [...p.options, ""] } : p)),
    );
  };

  const handleRemoveOptionFromProperty = (propId: string, optIndex: number): void => {
    setVariantProperties(
      variantProperties.map((p) =>
        p.id === propId ? { ...p, options: p.options.filter((_, idx) => idx !== optIndex) } : p,
      ),
    );
  };

  const handleOptionTextChangeForProperty = (
    propId: string,
    optIndex: number,
    textVal: string,
  ): void => {
    setVariantProperties(
      variantProperties.map((p) => {
        if (p.id !== propId) return p;
        const nextOpts = [...p.options];
        nextOpts[optIndex] = textVal;
        return { ...p, options: nextOpts };
      }),
    );
  };

  const handleProceedToPricingMultiple = (): void => {
    const filteredProps = filterVariantProperties(variantProperties);
    if (filteredProps.length === 0) return;
    const nextPrices: Record<string, Record<string, number>> = { ...variantPrices };
    for (const prop of filteredProps) {
      nextPrices[prop.id] = nextPrices[prop.id] || {};
      for (const opt of prop.options) {
        nextPrices[prop.id][opt] = nextPrices[prop.id][opt] || 0;
      }
    }
    setVariantPrices(nextPrices);
    setVariantStep(2);
  };

  const handleSaveVariantsMultiple = (): void => {
    const filteredProps = filterVariantProperties(variantProperties);
    const nextVariants: MenuItemVariant[] = filteredProps.map((p) => ({
      id: p.id,
      name: p.name.trim(),
      options: p.options.map((opt, i) => ({
        id: `opt_${p.id}_${i}`,
        name: opt.trim(),
        price: (variantPrices[p.id] && variantPrices[p.id][opt]) || 0,
      })),
    }));
    setVariants([...variants, ...nextVariants]);
    setIsCreatingVariantInline(false);
  };

  const handleRemoveVariant = (variantId: string): void => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const startNewVariant = (): void => {
    setVariantStep(1);
    setVariantProperties([
      { id: `prop_${Date.now()}`, name: "Size", options: ["Small", "Medium", "Large"] },
    ]);
    setVariantPrices({});
    setIsCreatingVariantInline(true);
  };

  const handleToggleAddonGroup = (groupId: string): void => {
    setSelectedAddonGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  const handleAddNewAddonOptionInline = (groupId: string): void => {
    if (!newInlineAddonName.trim()) return;
    const newOpt: MenuItemAddon = {
      id: `add_${Date.now()}`,
      name: newInlineAddonName.trim(),
      price: newInlineAddonPrice || 0,
    };
    setAddonGroups(
      addonGroups.map((g) => (g.id === groupId ? { ...g, options: [...g.options, newOpt] } : g)),
    );
    setNewInlineAddonName("");
    setNewInlineAddonPrice(0);
  };

  const handleRemoveAddonOptionInline = (groupId: string, optId: string): void => {
    setAddonGroups(
      addonGroups.map((g) =>
        g.id === groupId ? { ...g, options: g.options.filter((o) => o.id !== optId) } : g,
      ),
    );
  };

  const handleAddonOptionFieldChangeInline = (
    groupId: string,
    optId: string,
    field: "name" | "price",
    val: string | number,
  ): void => {
    setAddonGroups(
      addonGroups.map((g) => {
        if (g.id !== groupId) return g;
        const nextOpts = g.options.map((o) => {
          if (o.id !== optId) return o;
          return { ...o, [field]: field === "price" ? Math.max(0, Number(val)) : val };
        });
        return { ...g, options: nextOpts };
      }),
    );
  };

  const handleAddAddonOptionInput = (): void => {
    setNewAddonGroupOptionsText((prev) => [...prev, ""]);
  };

  const handleAddonOptionTextChange = (index: number, value: string): void => {
    setNewAddonGroupOptionsText((prev) => {
      const next = [...prev];
      const oldVal = next[index];
      next[index] = value;
      if (oldVal && newAddonGroupPrices[oldVal] !== undefined) {
        const nextPrices = { ...newAddonGroupPrices };
        nextPrices[value] = nextPrices[oldVal];
        delete nextPrices[oldVal];
        setNewAddonGroupPrices(nextPrices);
      }
      return next;
    });
  };

  const handleRemoveAddonOptionInput = (index: number): void => {
    setNewAddonGroupOptionsText((prev) => {
      const optToRemove = prev[index];
      if (optToRemove) {
        const nextPrices = { ...newAddonGroupPrices };
        delete nextPrices[optToRemove];
        setNewAddonGroupPrices(nextPrices);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleCreateAddonGroup = (): void => {
    if (!newAddonGroupName.trim()) return;
    const groupId = `grp_${Date.now()}`;
    const newGroup = {
      id: groupId,
      name: newAddonGroupName.trim(),
      options: newAddonGroupOptionsText
        .filter((opt) => opt.trim() !== "")
        .map((opt, i) => ({
          id: `add_${groupId}_${i}`,
          name: opt.trim(),
          price: newAddonGroupPrices[opt] || 0,
        })),
    };
    setAddonGroups((prev) => [...prev, newGroup]);
    setSelectedAddonGroupIds((prev) => [...prev, groupId]);
    setShowAddAddonGroupModal(false);
    setNewAddonGroupName("");
    setNewAddonGroupOptionsText(["Option 1", "Option 2"]);
    setNewAddonGroupPrices({});
  };

  const handleCategoryChange = (newCat: string): void => {
    setCategory(newCat);
    setSubcategory("");
    setIsCreatingNewSubcategory(false);
  };

  const handleVariantPriceChange = (propId: string, opt: string, value: number): void => {
    const updatedPropPrices = { ...(variantPrices[propId] || {}) };
    updatedPropPrices[opt] = Math.max(0, value);
    setVariantPrices({ ...variantPrices, [propId]: updatedPropPrices });
  };

  const openPhotoModal = (): void => {
    setPhotoTab("upload");
    setShowPhotoModal(true);
  };

  const selectStockImage = (url: string): void => {
    setSelectedStockImage(url);
    setImage(url);
  };

  return {
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    foodType,
    setFoodType,
    serviceType,
    setServiceType,
    category,
    subcategory,
    setSubcategory,
    isCreatingNewSubcategory,
    setIsCreatingNewSubcategory,
    subcategoryOptions,
    image,
    setImage,
    packagingCharge,
    setPackagingCharge,
    variants,
    isVariantsExpanded,
    setIsVariantsExpanded,
    isAddonsExpanded,
    setIsAddonsExpanded,
    customChargesList,
    showAddChargeModal,
    setShowAddChargeModal,
    newChargeName,
    setNewChargeName,
    newChargeAmount,
    setNewChargeAmount,
    showPhotoModal,
    setShowPhotoModal,
    photoTab,
    setPhotoTab,
    fileInputRef,
    imageSearchQuery,
    setImageSearchQuery,
    selectedStockImage,
    searchResults,
    isSearchingImages,
    imageSearchError,
    suggestedSearches: SUGGESTED_SEARCHES,
    isCreatingVariantInline,
    setIsCreatingVariantInline,
    variantStep,
    setVariantStep,
    variantProperties,
    variantPrices,
    searchAddonQuery,
    setSearchAddonQuery,
    filteredAddonGroups,
    selectedAddonGroupIds,
    showAddAddonGroupModal,
    setShowAddAddonGroupModal,
    newAddonGroupName,
    setNewAddonGroupName,
    newAddonGroupOptionsText,
    newAddonGroupPrices,
    setNewAddonGroupPrices,
    editingAddonGroupId,
    setEditingAddonGroupId,
    newInlineAddonName,
    setNewInlineAddonName,
    newInlineAddonPrice,
    setNewInlineAddonPrice,
    mappedAddons,
    handleSave,
    handleCreateCharge,
    handleSelectTemplate,
    handleAddNewPropertyBlock,
    handleRemovePropertyBlock,
    handlePropertyNameChange,
    handleAddOptionToProperty,
    handleRemoveOptionFromProperty,
    handleOptionTextChangeForProperty,
    handleProceedToPricingMultiple,
    handleSaveVariantsMultiple,
    handleRemoveVariant,
    startNewVariant,
    handleToggleAddonGroup,
    handleAddNewAddonOptionInline,
    handleRemoveAddonOptionInline,
    handleAddonOptionFieldChangeInline,
    handleAddAddonOptionInput,
    handleAddonOptionTextChange,
    handleRemoveAddonOptionInput,
    handleCreateAddonGroup,
    handleCategoryChange,
    handleVariantPriceChange,
    handleUploadClick,
    handleFileChange,
    openPhotoModal,
    selectStockImage,
  };
}

export type EditItemForm = ReturnType<typeof useEditItemForm>;
