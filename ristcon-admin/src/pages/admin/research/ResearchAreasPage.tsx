import { useEffect, useState } from 'react';
import { useEditions } from '@/hooks/useEditions';
import {
  useResearchCategories,
  useDeleteResearchCategory,
  useResearchAreas,
  useDeleteResearchArea,
} from '@/hooks/useResearchAreas';
import type { ResearchCategory, ResearchArea } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, MoreVertical, Pencil, Trash2, FolderOpen, FileText } from 'lucide-react';
import ResearchCategoryFormDialog from './ResearchCategoryFormDialog';
import ResearchAreaFormDialog from './ResearchAreaFormDialog';

export default function ResearchAreasPage() {
  const { data: editions, isLoading: loadingEditions } = useEditions();
  const [selectedEditionId, setSelectedEditionId] = useState<number | null>(null);
  const { data: categories, isLoading: loadingCategories } = useResearchCategories(selectedEditionId);
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | null>(null);
  const { data: areas, isLoading: loadingAreas } = useResearchAreas(selectedCategory?.id || null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ResearchCategory | null>(null);
  const [editingArea, setEditingArea] = useState<ResearchArea | null>(null);

  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ResearchCategory | null>(null);
  const [deleteAreaDialogOpen, setDeleteAreaDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<ResearchArea | null>(null);

  const deleteCategory = useDeleteResearchCategory(selectedEditionId || 0);
  const deleteArea = useDeleteResearchArea(selectedCategory?.id || 0);

  useEffect(() => {
    if (editions && editions.length > 0 && !selectedEditionId) {
      setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEditionId]);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: ResearchCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (category: ResearchCategory) => {
    setCategoryToDelete(category);
    setDeleteCategoryDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      if (selectedCategory?.id === categoryToDelete.id) {
        setSelectedCategory(null);
      }
      setDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddArea = () => {
    if (!selectedCategory) return;
    setEditingArea(null);
    setAreaDialogOpen(true);
  };

  const handleEditArea = (area: ResearchArea) => {
    setEditingArea(area);
    setAreaDialogOpen(true);
  };

  const handleDeleteArea = (area: ResearchArea) => {
    setAreaToDelete(area);
    setDeleteAreaDialogOpen(true);
  };

  const confirmDeleteArea = async () => {
    if (areaToDelete) {
      await deleteArea.mutateAsync(areaToDelete.id);
      setDeleteAreaDialogOpen(false);
      setAreaToDelete(null);
    }
  };

  if (loadingEditions) {
    return <div className="p-6">Loading editions...</div>;
  }

  if (!editions || editions.length === 0) {
    return (
      <div className="p-6">
        <p>No editions available. Please create an edition first.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Research Areas</h1>
          <p className="text-gray-600 mt-1">
            Manage research categories and areas for conference editions
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Edition:</label>
        <Select
          value={selectedEditionId?.toString() || ''}
          onValueChange={(value) => {
            setSelectedEditionId(Number(value));
            setSelectedCategory(null);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {editions.map((edition) => (
              <SelectItem key={edition.id} value={edition.id.toString()}>
                {edition.year} - {edition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Panel */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Research Categories</CardTitle>
                <CardDescription>Manage category codes and names</CardDescription>
              </div>
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingCategories ? (
              <div>Loading categories...</div>
            ) : !categories || categories.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No categories yet</p>
                <Button onClick={handleAddCategory} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Category
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCategory?.id === category.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {category.category_code}
                          </Badge>
                          <span className="font-medium">{category.category_name}</span>
                          {!category.is_active && (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {category.research_areas_count || 0} areas
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Research Areas Panel */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Research Areas</CardTitle>
                <CardDescription>
                  {selectedCategory
                    ? `Areas under ${selectedCategory.category_name}`
                    : 'Select a category to view areas'}
                </CardDescription>
              </div>
              {selectedCategory && (
                <Button onClick={handleAddArea} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Area
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedCategory ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>Select a category from the left to manage its research areas</p>
              </div>
            ) : loadingAreas ? (
              <div>Loading areas...</div>
            ) : !areas || areas.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No research areas yet</p>
                <Button onClick={handleAddArea} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Area
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Area Name</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {areas.map((area) => (
                      <TableRow key={area.id}>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{area.area_name}</span>
                              {!area.is_active && (
                                <Badge variant="secondary" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            {area.alternate_names && area.alternate_names.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Also: {area.alternate_names.join(', ')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{area.display_order}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditArea(area)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Area
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteArea(area)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Area
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ResearchCategoryFormDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={editingCategory}
        editionId={selectedEditionId || 0}
      />

      {selectedCategory && (
        <ResearchAreaFormDialog
          open={areaDialogOpen}
          onOpenChange={setAreaDialogOpen}
          area={editingArea}
          categoryId={selectedCategory.id}
        />
      )}

      <AlertDialog open={deleteCategoryDialogOpen} onOpenChange={setDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Research Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete category "{categoryToDelete?.category_name}"? All associated research areas will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAreaDialogOpen} onOpenChange={setDeleteAreaDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Research Area</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{areaToDelete?.area_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteArea} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
