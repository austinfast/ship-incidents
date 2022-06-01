MAPSHAPER = node_modules/mapshaper/bin/mapshaper

.INTERMEDIATE: output_data/cb_2021_us_state_500k.zip output_data/cb_2021_us_state_500k/cb_2021_us_state_500k.shp

.PHONY: clean clean-deps default

default: src/static/states_topo.json

clean: clean-deps

clean-deps:
	rm -rf output_data

src/static/states_topo.json: output_data/cb_2021_us_state_500k/cb_2021_us_state_500k.shp
	mkdir -p $(dir $@)
	$(MAPSHAPER) $^ -rename-layers states -o format=topojson $@
	touch $@

output_data/cb_2021_us_state_500k/cb_2021_us_state_500k.shp: output_data/cb_2021_us_state_500k.zip
	mkdir -p $(dir $@)
	unzip -o $^ -d $(dir $@)
	touch $@

output_data/cb_2021_us_state_500k.zip:
	mkdir -p $(dir $@)
	curl -o $@ -L https://www2.census.gov/geo/tiger/GENZ2021/shp/cb_2021_us_state_500k.zip
	touch $@
