import React from 'react';

interface GenericPageProps {
  title: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default GenericPage; 