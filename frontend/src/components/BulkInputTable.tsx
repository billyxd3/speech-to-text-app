import React from "react";

interface Language {
  code: string;
  name: string;
}

interface TextPair {
  text1: string;
  text2: string;
  language1: string;
  language2: string;
}

interface BulkInputTableProps {
  pairs: TextPair[];
  setPairs: React.Dispatch<React.SetStateAction<TextPair[]>>;
  languages: Language[];
}

const BulkInputTable: React.FC<BulkInputTableProps> = ({ pairs, setPairs, languages }) => {
  const handlePairChange = (index: number, field: keyof TextPair, value: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setPairs(newPairs);
  };

  const handleRemovePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  const handleSwapPair = (index: number) => {
    const newPairs = [...pairs];
    const pair = newPairs[index];
    newPairs[index] = {
      text1: pair.text2,
      text2: pair.text1,
      language1: pair.language2,
      language2: pair.language1,
    };
    setPairs(newPairs);
  };

  return (
    <div className="bulk-input-table">
      <table>
        <thead>
          <tr>
            <th>First Text</th>
            <th>Language</th>
            <th>Second Text</th>
            <th>Language</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={pair.text1}
                  onChange={(e) => handlePairChange(index, "text1", e.target.value)}
                />
              </td>
              <td>
                <select value={pair.language1} onChange={(e) => handlePairChange(index, "language1", e.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={pair.text2}
                  onChange={(e) => handlePairChange(index, "text2", e.target.value)}
                />
              </td>
              <td>
                <select value={pair.language2} onChange={(e) => handlePairChange(index, "language2", e.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button className="action-button swap" onClick={() => handleSwapPair(index)}>
                  ↑↓
                </button>
                <button className="action-button remove" onClick={() => handleRemovePair(index)}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BulkInputTable;
