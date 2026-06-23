"use client";

import { FieldLabel } from "@/components/common/FieldLabel";
import { CharCountField } from "./CharCountField";
import { EditItemChevronSelect } from "./EditItemChevronSelect";
import { EditItemFoodTypeSelector } from "./EditItemFoodTypeSelector";
import { EditItemPhotoThumb } from "./EditItemPhotoThumb";
import { EditItemSectionHeading } from "./EditItemSectionHeading";
import { EditItemSubcategoryField } from "./EditItemSubcategoryField";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemBasicFieldsProps {
  form: EditItemForm;
  categories: string[];
}

export function EditItemBasicFields({
  form,
  categories,
}: EditItemBasicFieldsProps): React.JSX.Element {
  const {
    name,
    setName,
    description,
    setDescription,
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
    handleCategoryChange,
    openPhotoModal,
  } = form;

  return (
    <div className="space-y-4">
      <EditItemSectionHeading>Basic Details</EditItemSectionHeading>

      <CharCountField
        label="Item Name"
        value={name}
        maxLength={70}
        onChange={setName}
        placeholder="Enter dish name"
      />

      <CharCountField
        label="Item Description"
        value={description}
        maxLength={500}
        onChange={setDescription}
        placeholder="Add a detailed description explaining the dish"
        multiline
      />

      <EditItemFoodTypeSelector value={foodType} onChange={setFoodType} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <FieldLabel>Service Type</FieldLabel>
          <EditItemChevronSelect
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="Delivery">Delivery</option>
            <option value="Dining">Dining</option>
            <option value="Both">Both</option>
          </EditItemChevronSelect>
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Menu Category</FieldLabel>
          <EditItemChevronSelect
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </EditItemChevronSelect>
        </div>
      </div>

      <EditItemSubcategoryField
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        isCreatingNewSubcategory={isCreatingNewSubcategory}
        setIsCreatingNewSubcategory={setIsCreatingNewSubcategory}
        subcategoryOptions={subcategoryOptions}
      />

      <EditItemPhotoThumb image={image} onClick={openPhotoModal} />
    </div>
  );
}
