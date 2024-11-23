import React, { MouseEventHandler } from 'react';

type CardItemProps = {
  card: {
    _id: string;
    title: string;
    description?: string;
  };
  onClick: MouseEventHandler<HTMLDivElement>;
};

export default function CardItem({ card, onClick }: CardItemProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white border rounded shadow-sm mb-2 cursor-pointer hover:shadow-lg hover:bg-gray-100 transition duration-200"
    >
      <h4 className="text-lg font-semibold">{card.title}</h4>
    </div>
  );
}
