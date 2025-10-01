import React, { useEffect, useState } from 'react';
import { getProductioncategory } from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';

function CategorySummaryPieCharts() {
    const [categorySummary, setCategorySummary] = useState([]);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const { reportId } = useParams();

    useEffect(() => {
        const fetchProduction = async () => {
            setLoadingFetch(true);
            try {
                const res = await getProductioncategory(reportId);
                setCategorySummary(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingFetch(false);
            }
        };
        if (reportId) fetchProduction();
    }, [reportId]);

    if (loadingFetch) return <p>Loading...</p>;
    if (!categorySummary.length) return <p>No data available</p>;

    // Umumiy chart uchun data (har bir kategoriya -> qiymat sifatida actual yoki normadan birini olamiz)
    const data = categorySummary.map(cat => ({
        name: cat.category_name,
        value: cat.norm,   // yoki cat.norm ishlatsa ham bo‘ladi
    }));

    // Ranglar (kategoriya soniga qarab turlicha bo‘lishi mumkin)
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        dataKey="value"
                        paddingAngle={4}
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CategorySummaryPieCharts;
