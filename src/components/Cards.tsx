import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card.tsx";

interface CardProps {
    name: string
    content?: number
    icon?: React.ReactNode

}
const Cards: React.FC<CardProps> = ({name, content, icon}: CardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{name}</CardTitle> {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{content}</div>
            </CardContent>
        </Card>
    )
}

export default Cards;