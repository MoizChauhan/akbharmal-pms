import { getGlassMasters, getAluminumMasters } from "@/lib/services/cmsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GlassTable, AluminumTable } from "@/components/cms/MasterTables";

export default async function CMSPage() {
    const [glass, aluminum] = await Promise.all([
        getGlassMasters(),
        getAluminumMasters(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
                <p className="text-muted-foreground">Manage master data and pricing</p>
            </div>
            <Tabs defaultValue="glass" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="glass">Glass Master</TabsTrigger>
                    <TabsTrigger value="aluminum">Aluminum Master</TabsTrigger>
                </TabsList>
                <TabsContent value="glass">
                    <Card>
                        <CardHeader>
                            <CardTitle>Glass Master</CardTitle>
                            <CardDescription>Configure glass types and pricing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GlassTable data={glass} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="aluminum">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aluminum Master</CardTitle>
                            <CardDescription>Configure aluminum profiles and calculation constants</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AluminumTable data={aluminum} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
