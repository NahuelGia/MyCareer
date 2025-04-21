import { Checkbox, HStack } from "@chakra-ui/react";

export const BasicCheckbox = ({
   label,
   checked,
   onCheckedChange,
}: {
   label: string;
   checked: boolean;
   onCheckedChange: () => any;
}) => {
   return (
      <HStack align="flex-start">
         <Checkbox.Root variant={"solid"} checked={checked} onCheckedChange={onCheckedChange}>
            <Checkbox.HiddenInput />
            <Checkbox.Control cursor={"pointer"} />
            <Checkbox.Label>{label}</Checkbox.Label>
         </Checkbox.Root>
      </HStack>
   );
};
