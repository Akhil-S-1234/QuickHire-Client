import Link from 'next/link';

interface DropdownMenuProps {
  items: { label: string; href: string; onClick?: () => void }[];
  isOpen: boolean;
  align: 'left' | 'right';
}

const DropdownMenu = ({ items, isOpen, align }: DropdownMenuProps) => {
  if (!isOpen) return null;

  const dropdownPosition = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={`absolute top-full pt-3 ${dropdownPosition}`}>
      <div className="w-40 bg-white border border-gray-300 shadow-lg rounded-md ">
        {items.map((item, index) => (
          <span key={index} onClick={item.onClick}>

            {item.href ? (
              <Link href={item.href}>
                <span className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            ) : (
              <span className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap cursor-pointer">
                {item.label}
              </span>
            )}  

          </span>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
