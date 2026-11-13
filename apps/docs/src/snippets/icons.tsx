import { PlusIcon, SearchIcon } from '@up201905892/icons';
import { Button } from '@up201905892/ui';

export function IconExamples() {
  return (
    <>
      {/* Decorative icon next to a text label: hidden from assistive technology. */}
      <Button leadingIcon={<PlusIcon />}>Add item</Button>
      {/* Standalone icon with a meaning: give it a title so it is announced. */}
      <SearchIcon title="Search" size={24} />
    </>
  );
}
