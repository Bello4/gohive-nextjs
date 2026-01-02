"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/home/layout/header/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import {
  getStores,
  type StoreCard as StoreCardType,
} from "@/queries/stores-list";
import Loading from "@/components/shared/loading";
import ErrorComponent from "@/components/shared/error-component";

export default function StoresPage() {
  const [stores, setStores] = useState<StoreCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("average_rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile filters state
  const [showFilters, setShowFilters] = useState(false);

  // Fetch stores when filters change
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: any = {
          page: currentPage,
          per_page: 12,
          sort_by: sortBy,
          sort_order: sortOrder,
        };

        if (search) params.search = search;
        if (minRating) params.min_rating = parseFloat(minRating);
        if (featuredOnly) params.featured = true;

        const response = await getStores(params);
        setStores(response.stores);
        setMeta(response.meta);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [search, minRating, featuredOnly, sortBy, sortOrder, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setMinRating(null);
    setFeaturedOnly(false);
    setSortBy("average_rating");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Count active filters for badge
  const activeFiltersCount = [
    search ? 1 : 0,
    minRating ? 1 : 0,
    featuredOnly ? 1 : 0,
    sortBy !== "average_rating" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorComponent
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">All Stores</h1> */}
          <p className="text-gray-600">Discover amazing stores and sellers</p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardContent className="p-2">
            {/* Always visible search on mobile, rest collapsible */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search - Always visible */}
              <form
                onSubmit={handleSearch}
                className="flex-1 w-full lg:max-w-md"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search stores by name or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Filter controls - Hidden on mobile when collapsed */}
              <div
                className={`
              w-full lg:w-auto
              ${showFilters ? "block" : "hidden lg:flex"}
              flex-col lg:flex-row gap-4 items-start lg:items-center
            `}
              >
                {/* Rating Filter */}
                <Select
                  value={minRating || "all"}
                  onValueChange={(value) =>
                    setMinRating(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4">4★ & above</SelectItem>
                    <SelectItem value="3">3★ & above</SelectItem>
                    <SelectItem value="2">2★ & above</SelectItem>
                    <SelectItem value="1">1★ & above</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="average_rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="num_reviews">Reviews</SelectItem>
                    <SelectItem value="created_at">Newest</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full lg:w-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Featured Filter - Hidden on mobile when collapsed */}
            <div
              className={`
            mt-4 flex items-center
            ${showFilters ? "block" : "hidden lg:flex"}
          `}
            >
              <input
                type="checkbox"
                id="featured"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Featured Stores Only
              </label>
            </div>

            {/* Mobile Apply Filters Button */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {meta?.from || 0}-{meta?.to || 0} of {meta?.total || 0}{" "}
              stores
            </p>
            {/* Mobile filter indicator */}
            {activeFiltersCount > 0 && (
              <div className="lg:hidden text-sm text-gray-500">
                {activeFiltersCount} active filter
                {activeFiltersCount !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        {/* Stores Grid */}
        {loading ? (
          <Loading />
        ) : stores.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No stores found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {stores.map((store) => (
                <StoreCardComponent key={store.id} store={store} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  disabled={currentPage === meta.last_page}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// Store Card Component
function StoreCardComponent({ store }: { store: StoreCardType }) {
  return (
    <Link href={`/store/${store.url}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <CardContent className="p-0">
          {/* Store Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {store.cover ? (
              <img
                src={store.cover}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                🏪
              </div>
            )}
            {store.featured ? (
              <Badge className="absolute top-2 left-2 bg-orange-500">
                Featured
              </Badge>
            ) : (
              <></>
            )}
          </div>

          {/* Store Info */}
          <div className="p-4">
            {/* Logo and Name */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">🏪</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {store.description}
                </p>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {store.average_rating
                    ? Number(store.average_rating).toFixed(2)
                    : "0.0"}
                </span>
                <span className="text-sm text-gray-500">
                  ({store.num_reviews} reviews)
                </span>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {store.default_delivery_time_min}-
                {store.default_delivery_time_max} minutes
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
