'use client';
import React, { FC, useState, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Text } from 'react-konva';
import { Annotation_Res, Annotation_Req } from '@/core/models';
import { memo } from 'react';
import { Box } from '@mui/material';
import useImage from 'use-image';

interface AnnotationCanvasProps {
	imageUrl: string;
	annotations: Annotation_Res[];
	imageId: string | number; // Add imageId prop to avoid fallback issues
	onSaveAnnotation: (annotation: Annotation_Req) => void;
	onDeleteAnnotation: (annotation: Annotation_Res) => void;
	annotationColor: string;
}

const AnnotationRect = memo(({ annotation, onClick }: { annotation: Annotation_Res; onClick: () => void }) => (
	<Rect
		x={annotation.coordinates.x}
		y={annotation.coordinates.y}
		width={annotation.coordinates.width}
		height={annotation.coordinates.height}
		stroke={annotation.color}
		strokeWidth={2}
		onClick={onClick}
	/>
));

const AnnotationCanvas: FC<AnnotationCanvasProps> = ({
	imageUrl,
	annotations,
	imageId,
	onSaveAnnotation,
	onDeleteAnnotation,
	annotationColor,
}) => {
	const [image] = useImage(imageUrl);
	const [isDrawing, setIsDrawing] = useState(false);
	const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
	const [currentRect, setCurrentRect] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const stageRef = useRef<any>(null);

	const getNextAnnotationId = () => {
		const maxId = annotations.reduce((max: any, a) => (a.id > max ? a.id : max), 1000);
		return maxId + 1;
	};

	const handleMouseDown = (e: any) => {
		const pos = e.target.getStage().getPointerPosition();
		setIsDrawing(true);
		setStartPos({ x: pos.x, y: pos.y });
	};

	const handleMouseMove = (e: any) => {
		if (!isDrawing || !startPos) return;
		const pos = e.target.getStage().getPointerPosition();
		const width = pos.x - startPos.x;
		const height = pos.y - startPos.y;

		setCurrentRect({
			x: Math.min(startPos.x, pos.x),
			y: Math.min(startPos.y, pos.y),
			width: Math.abs(width),
			height: Math.abs(height),
		});
	};

	const handleMouseUp = (e: any) => {
		if (!isDrawing || !startPos) return;
		const pos = e.target.getStage().getPointerPosition();
		const width = pos.x - startPos.x;
		const height = pos.y - startPos.y;

		if (Math.abs(width) > 5 && Math.abs(height) > 5) {
			const newAnnotation = {
				id: getNextAnnotationId(),
				imageId,
				coordinates: {
					x: Math.min(startPos.x, pos.x),
					y: Math.min(startPos.y, pos.y),
					width: Math.abs(width),
					height: Math.abs(height),
				},
				color: annotationColor,
			};
			// Ensure no duplicate annotations are added
			onSaveAnnotation(newAnnotation);
		}

		setIsDrawing(false);
		setStartPos(null);
		setCurrentRect(null);
	};

	// Calculate stage dimensions based on image
	const stageWidth = image ? Math.min(image.width, 600) : 600;
	const stageHeight = image ? Math.min(image.height, 400) : 400;
	console.log('annotations', annotations);
	return (
		<Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
			<Stage
				width={stageWidth}
				height={stageHeight}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp} // Re-enable onMouseUp
				ref={stageRef}
			>
				<Layer>
					{image && (
						<KonvaImage
							image={image}
							width={stageWidth}
							height={stageHeight}
							// scaleX={stageWidth / (image.width || 1)}
							// scaleY={stageHeight / (image.height || 1)}
						/>
					)}

					{annotations.map((annotation) => (
						<Group key={annotation.id}>
							<AnnotationRect
								key={annotation.id}
								annotation={annotation}
								onClick={() => console.log(`Selected annotation ${annotation.id}`)}
							/>
							<Rect
								x={annotation.coordinates.x + annotation.coordinates.width - 10}
								y={annotation.coordinates.y + -5}
								width={15}
								height={15}
								fill='white'
								stroke='black'
								strokeWidth={1}
							/>
							<Text
								x={annotation.coordinates.x + annotation.coordinates.width - 10} // Top-right corner
								y={annotation.coordinates.y + -5}
								text='X'
								fontSize={14}
								fontFamily='Arial'
								fill='red'
								width={15}
								height={15}
								align='center'
								verticalAlign='middle'
								onClick={() => onDeleteAnnotation(annotation)}
								onTap={() => onDeleteAnnotation(annotation)} // Support touch devices
								onMouseEnter={(e: any) => {
									e.target.getStage().container().style.cursor = 'pointer';
								}}
								onMouseLeave={(e: any) => {
									e.target.getStage().container().style.cursor = 'default';
								}}
								listening={true} // Ensure the Text is interactive
							/>
						</Group>
					))}

					{isDrawing && currentRect && (
						<Rect
							x={currentRect.x}
							y={currentRect.y}
							width={currentRect.width}
							height={currentRect.height}
							stroke={annotationColor}
							strokeWidth={2}
						/>
					)}
				</Layer>
			</Stage>
		</Box>
	);
};

export default AnnotationCanvas;
